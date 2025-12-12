"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = VerifyEmail;
const jsx_runtime_1 = require("react/jsx-runtime");
const components_1 = require("@react-email/components");
const _layout_1 = require("./_layout");
function VerifyEmail({ username, verifyLink }) {
    return ((0, jsx_runtime_1.jsxs)(_layout_1.EmailLayout, { preview: "Verify your email address - Yukikaze Music Player", children: [(0, jsx_runtime_1.jsxs)(components_1.Text, { style: { fontSize: '16px', color: '#333' }, children: ["Hi ", (0, jsx_runtime_1.jsx)("strong", { children: username }), ","] }), (0, jsx_runtime_1.jsx)(components_1.Text, { style: { fontSize: '16px', color: '#333', lineHeight: '1.6' }, children: "Thank you for signing up for Yukikaze Music Player! To complete your registration and start uploading music & creating playlists, please verify your email address by clicking the button below." }), (0, jsx_runtime_1.jsx)(components_1.Section, { style: { textAlign: 'center', margin: '30px 0' }, children: (0, jsx_runtime_1.jsx)(components_1.Button, { href: verifyLink, style: {
                        backgroundColor: '#0E8080',
                        color: 'white',
                        textDecoration: 'none',
                        padding: '10px 16px',
                        borderRadius: '6px',
                        fontWeight: '500',
                        fontSize: '14px',
                        lineHeight: '20px',
                        margin: '0 auto',
                    }, children: "Verify Email Address" }) }), (0, jsx_runtime_1.jsx)(components_1.Text, { style: { fontSize: '14px', color: '#666', lineHeight: '1.6' }, children: "Or copy and paste this link into your browser:" }), (0, jsx_runtime_1.jsx)(components_1.Text, { style: {
                    fontSize: '13px',
                    color: '#0E8080',
                    wordBreak: 'break-all',
                    background: '#f5f5f5',
                    padding: '10px',
                    borderRadius: '4px'
                }, children: (0, jsx_runtime_1.jsx)(components_1.Link, { href: verifyLink, children: verifyLink }) }), (0, jsx_runtime_1.jsxs)(components_1.Section, { style: { marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #ddd' }, children: [(0, jsx_runtime_1.jsxs)(components_1.Text, { style: { color: '#999', fontSize: '12px', lineHeight: '1.5' }, children: [(0, jsx_runtime_1.jsx)("strong", { children: "Note:" }), " This verification link will expire in 1 hour."] }), (0, jsx_runtime_1.jsx)(components_1.Text, { style: { color: '#666', fontSize: '12px', lineHeight: '1.5' }, children: "If you didn't create an account with Tien Music Player, please ignore this email or contact our support team if you have concerns." })] })] }));
}
