"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ResetPassword;
const jsx_runtime_1 = require("react/jsx-runtime");
const components_1 = require("@react-email/components");
const _layout_1 = require("./_layout");
function ResetPassword({ username, resetLink }) {
    const formattedDate = new Intl.DateTimeFormat('en', {
        dateStyle: 'medium',
        timeStyle: 'medium',
    }).format(new Date());
    return ((0, jsx_runtime_1.jsxs)(_layout_1.EmailLayout, { children: [(0, jsx_runtime_1.jsxs)(components_1.Text, { children: ["Hi ", (0, jsx_runtime_1.jsx)("strong", { children: username }), ","] }), (0, jsx_runtime_1.jsxs)(components_1.Text, { children: ["You updated the password for your account on ", formattedDate, ". If this was you, then no further action is required."] }), (0, jsx_runtime_1.jsx)(components_1.Text, { children: "However if you did NOT perform this password change, just ignore this email and your password will remain unchanged. If you want to reset your password, please click the link below:" }), (0, jsx_runtime_1.jsx)(components_1.Section, { style: { textAlign: 'center', margin: '20px 0' }, children: (0, jsx_runtime_1.jsx)(components_1.Button, { href: resetLink, style: {
                        backgroundColor: '#0E8080',
                        color: 'white',
                        textDecoration: 'none',
                        padding: '10px 16px',
                        borderRadius: '6px',
                        fontWeight: '500',
                        fontSize: '14px',
                        lineHeight: '20px',
                        margin: '0 auto',
                    }, children: "Reset Password" }) }), (0, jsx_runtime_1.jsxs)(components_1.Text, { children: ["Or copy and paste the following link into your browser:", ' ', (0, jsx_runtime_1.jsx)(components_1.Link, { href: resetLink, children: resetLink })] }), (0, jsx_runtime_1.jsxs)(components_1.Text, { children: ["Remember to use a password that is both strong and unique to your Yukinu account. To learn more about how to create a strong and unique password,", ' ', (0, jsx_runtime_1.jsx)(components_1.Link, { href: 'https://www.cisa.gov/secure-our-world/use-strong-passwords', children: "click here" }), "."] })] }));
}
