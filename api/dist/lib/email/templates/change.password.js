"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChangePassword;
const jsx_runtime_1 = require("react/jsx-runtime");
const components_1 = require("@react-email/components");
const _layout_1 = require("./_layout");
function ChangePassword({ username }) {
    const formattedDate = new Intl.DateTimeFormat('en', {
        dateStyle: 'medium',
        timeStyle: 'medium',
    }).format(new Date());
    return ((0, jsx_runtime_1.jsxs)(_layout_1.EmailLayout, { children: [(0, jsx_runtime_1.jsxs)(components_1.Text, { children: ["Hi ", (0, jsx_runtime_1.jsx)("strong", { children: username }), ","] }), (0, jsx_runtime_1.jsxs)(components_1.Text, { children: ["You updated the password for your account on ", formattedDate, ". If this was you, then no further action is required."] }), (0, jsx_runtime_1.jsx)(components_1.Text, { children: "However, if you did NOT perform this password change, we recommend that you reset your password immediately and review your account security settings." })] }));
}
