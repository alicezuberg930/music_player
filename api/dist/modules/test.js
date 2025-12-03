"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testRouter = void 0;
const express_1 = __importDefault(require("express"));
const googleapis_1 = require("googleapis");
const env_1 = __importDefault(require("../lib/helpers/env"));
const multer_options_1 = require("../lib/helpers/multer.options");
const multer_1 = __importDefault(require("multer"));
const drive_file_1 = require("../lib/helpers/drive.file");
const testRouter = express_1.default.Router();
exports.testRouter = testRouter;
const oauth2Client = new googleapis_1.google.auth.OAuth2(env_1.default.GOOGLE_CLIENT_ID, env_1.default.GOOGLE_CLIENT_SECRET, env_1.default.GOOGLE_REDIRECT_URI);
let REFRESH_TOKEN = env_1.default.GOOGLE_REFRESH_TOKEN;
testRouter.get("/auth/google", (req, res) => {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: "consent",
        scope: ['https://www.googleapis.com/auth/drive']
    });
    res.redirect(authUrl);
});
testRouter.get("/api/auth/callback/google", async (req, res) => {
    const code = req.query.code;
    if (!code)
        return res.status(400).send("Missing code");
    try {
        const { tokens } = await oauth2Client.getToken(code);
        console.log(tokens);
        // Access token (short-lived)
        // const accessToken = tokens.access_token;
        // Save refresh_token (long-lived)
        if (tokens.refresh_token) {
            REFRESH_TOKEN = tokens.refresh_token;
            // In real life: save to DB or env
            // await saveTokenToDb(tokens.refresh_token);
            console.log("New refresh token:", REFRESH_TOKEN);
        }
        else {
            console.warn("No refresh_token received. Maybe already granted before?");
        }
        oauth2Client.setCredentials(tokens);
        res.send("Google account connected. You can now use the backend to access Drive.");
    }
    catch (err) {
        console.error("Error exchanging code:", err);
        res.status(500).send(JSON.stringify(err));
    }
});
function getDriveClient() {
    if (!REFRESH_TOKEN) {
        throw new Error("No refresh token set. Go to /auth/google first.");
    }
    oauth2Client.setCredentials({
        refresh_token: REFRESH_TOKEN,
    });
    return googleapis_1.google.drive({ version: "v3", auth: oauth2Client });
}
testRouter.get("/drive/files", async (req, res) => {
    try {
        const drive = getDriveClient();
        // - use current access_token if valid
        // - or automatically use refresh_token to get a new access_token
        const response = await drive.files.list({
            pageSize: 10,
            fields: "files(id, name, webViewLink, webContentLink, iconLink, thumbnailLink)",
        });
        res.json(response.data.files || []);
    }
    catch (err) {
        console.error("Drive error:", err?.response?.data || err);
        if (err?.response?.data?.error === "invalid_grant") {
            return res.status(401).json({
                error: "REAUTH_REQUIRED",
                message: "Refresh token invalid. Please reconnect at /auth/google.",
            });
        }
        res.status(500).json({ error: "Drive API error", details: err.message });
    }
});
const uploadOptions = {
    allowedFields: ["audio", "lyrics", "thumbnail"],
    allowed: {
        audio: { mimes: ["audio/mpeg", "audio/wav"], exts: ["mp3", "wav"], maxSize: 15 * 1024 * 1024 },
        lyrics: { mimes: ["text/plain"], exts: ["lrc", "txt"], maxSize: 2 * 1024 * 1024 },
        thumbnail: { mimes: ["image/jpeg", "image/png"], exts: ["jpg", "jpeg", "png"], maxSize: 5 * 1024 * 1024 },
    },
};
const upload = (0, multer_1.default)((0, multer_options_1.multerOptions)(uploadOptions));
const DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || "1dz87C_CCZiFKUMfnRwd3BaqqCMFm5u9z";
testRouter.post("/drive/files", 
// upload.fields([
//     { name: "audio", maxCount: 1 },
//     { name: "lyrics", maxCount: 1 },
//     { name: "thumbnail", maxCount: 1 }
// ]),
upload.array("thumbnail", 5), async (req, res) => {
    try {
        if (!req.files) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        const data = await (0, drive_file_1.uploadFile)(req.files, '/audio');
        return res.json({ data });
    }
    catch (err) {
        console.error("Drive upload error:", err?.response?.data || err);
        if (err?.response?.data?.error === "invalid_grant") {
            return res.status(401).json({
                error: "REAUTH_REQUIRED",
                message: "Refresh token invalid. Please reconnect at /auth/google.",
            });
        }
        res.status(500).json({
            error: "Upload failed",
            details: err.message,
        });
    }
});
testRouter.delete("/drive/files/:id", async (req, res) => {
    const fileId = req.params.id;
    await (0, drive_file_1.deleteFile)(fileId);
    res.sendStatus(204);
});
