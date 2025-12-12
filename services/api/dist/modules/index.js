"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bannerRouter = exports.sitemapRouter = exports.userRouter = exports.playlistRouter = exports.artistRouter = exports.songRouter = void 0;
var song_route_1 = require("./songs/song.route");
Object.defineProperty(exports, "songRouter", { enumerable: true, get: function () { return song_route_1.songRouter; } });
var artist_route_1 = require("./artists/artist.route");
Object.defineProperty(exports, "artistRouter", { enumerable: true, get: function () { return artist_route_1.artistRouter; } });
var playlist_route_1 = require("./playlists/playlist.route");
Object.defineProperty(exports, "playlistRouter", { enumerable: true, get: function () { return playlist_route_1.playlistRouter; } });
var user_route_1 = require("./users/user.route");
Object.defineProperty(exports, "userRouter", { enumerable: true, get: function () { return user_route_1.userRouter; } });
var sitemap_route_1 = require("./sitemap/sitemap.route");
Object.defineProperty(exports, "sitemapRouter", { enumerable: true, get: function () { return sitemap_route_1.sitemapRouter; } });
var banner_route_1 = require("./banners/banner.route");
Object.defineProperty(exports, "bannerRouter", { enumerable: true, get: function () { return __importDefault(banner_route_1).default; } });
