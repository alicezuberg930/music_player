"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.esmMusicMetadata = exports.esmFileType = void 0;
const esmFileType = async () => await import('file-type');
exports.esmFileType = esmFileType;
const esmMusicMetadata = async () => await import('music-metadata');
exports.esmMusicMetadata = esmMusicMetadata;
