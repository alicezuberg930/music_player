"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailLayout = EmailLayout;
const jsx_runtime_1 = require("react/jsx-runtime");
const components_1 = require("@react-email/components");
function EmailLayout({ preview, children }) {
    return ((0, jsx_runtime_1.jsxs)(components_1.Html, { lang: 'en', children: [(0, jsx_runtime_1.jsxs)(components_1.Head, { children: [(0, jsx_runtime_1.jsx)(components_1.Preview, { children: preview ?? 'This is an important email from Yukikaze Music Player.' }), (0, jsx_runtime_1.jsx)(components_1.Font, { fontFamily: 'Geist', fallbackFontFamily: 'sans-serif', webFont: {
                            url: 'https://fonts.gstatic.com/s/geist/v4/gyByhwUxId8gMEwcGFU.woff2',
                            format: 'woff2',
                        }, fontWeight: 400, fontStyle: 'normal' })] }), (0, jsx_runtime_1.jsxs)(components_1.Body, { style: { backgroundColor: '#fafafa' }, children: [(0, jsx_runtime_1.jsxs)(components_1.Container, { style: {
                            borderRadius: '12px',
                            border: '1px solid #e4e4e4',
                            backgroundColor: '#ffffff',
                            padding: '24px',
                        }, children: [(0, jsx_runtime_1.jsx)(components_1.Img, { src: 'https://tien-music-player.site/web-app-manifest-512x512.png', width: 80, height: 80, alt: 'Yukikaze Music Player', style: { margin: '0 auto 20px auto' } }), children, (0, jsx_runtime_1.jsxs)(components_1.Text, { children: ["Still have questions? Please contact", ' ', (0, jsx_runtime_1.jsx)(components_1.Link, { href: 'mailto:support@yukikaze-music-player.site', children: "Yukikaze Support" })] })] }), (0, jsx_runtime_1.jsx)(components_1.Section, { style: { textAlign: 'center', color: '#525252' }, children: (0, jsx_runtime_1.jsxs)(components_1.Text, { children: ["@ ", new Date().getFullYear(), " Yukikaze Music Player. All rights reserved."] }) })] })] }));
}
