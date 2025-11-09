import express, { Request, Response } from "express"
import { google } from "googleapis"

const testRouter = express.Router()

const oauth2Client = new google.auth.OAuth2(
    "338520973807-cvr1jv3l3sjnj5l6htmvlbtt6c6omkfj.apps.googleusercontent.com",
    // process.env.GOOGLE_CLIENT_ID,
    "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",
    // process.env.GOOGLE_CLIENT_SECRET,
    "http://localhost:5000/api/auth/callback/google"
    // process.env.GOOGLE_REDIRECT_URI
)

let REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN ?? "1//0gsa8xm0Y0IS4CgYIARAAGBASNwF-L9IrcrY47E9M42zDMNuba6FFETEsc0CPctnxn-j5uJbcGnkoNnC5d0pPWbEp6ZfZ1thsFMY";

testRouter.get("/auth/google", (req, res) => {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: "consent",
        scope: ['https://www.googleapis.com/auth/drive']
    })

    res.redirect(authUrl);
});

testRouter.get("/api/auth/callback/google", async (req: Request, res: Response) => {
    const code = req.query.code as string | undefined;
    if (!code) return res.status(400).send("Missing code");

    try {
        const { tokens } = await oauth2Client.getToken(code);
        console.log(tokens)
        // Access token (short-lived)
        // const accessToken = tokens.access_token;

        // Save refresh_token (long-lived)
        if (tokens.refresh_token) {
            REFRESH_TOKEN = tokens.refresh_token;

            // In real life: save to DB or env
            // await saveTokenToDb(tokens.refresh_token);
            console.log("New refresh token:", REFRESH_TOKEN);
        } else {
            console.warn("No refresh_token received. Maybe already granted before?");
        }

        oauth2Client.setCredentials(tokens);

        res.send("Google account connected. You can now use the backend to access Drive.");
    } catch (err) {
        console.error("Error exchanging code:", err);
        res.status(500).send(JSON.stringify(err));
    }
})

function getDriveClient() {
    if (!REFRESH_TOKEN) {
        throw new Error("No refresh token set. Go to /auth/google first.");
    }

    oauth2Client.setCredentials({
        refresh_token: REFRESH_TOKEN,
    });

    return google.drive({ version: "v3", auth: oauth2Client });
}

testRouter.get("/drive/files", async (req, res) => {
    try {
        const drive = getDriveClient();

        // This call will:
        // - use current access_token if valid
        // - or automatically use refresh_token to get a new access_token
        const response = await drive.files.list({
            pageSize: 10,
            fields: "files(id, name)",
        });

        res.json(response.data.files || []);
    } catch (err: any) {
        console.error("Drive error:", err?.response?.data || err);

        // If refresh_token is invalid/revoked → force re-auth
        if (err?.response?.data?.error === "invalid_grant") {
            return res.status(401).json({
                error: "REAUTH_REQUIRED",
                message: "Refresh token invalid. Please reconnect at /auth/google.",
            });
        }

        res.status(500).json({ error: "Drive API error", details: err.message });
    }
});

export { testRouter }