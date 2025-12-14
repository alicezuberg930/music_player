var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Transform } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsString } from "class-validator";
export class PlaylistSongDto {
    songIds;
}
__decorate([
    IsArray({ message: 'Songs must be an array' }),
    ArrayNotEmpty({ message: 'Songs cannot be empty' }),
    IsString({ each: true, message: 'Each song id must be a string' }),
    Transform(({ value }) => {
        // Accept already-parsed arrays, JSON strings like "['a','b']", or comma-separated "a,b,b"
        if (Array.isArray(value))
            return value.map((v) => String(v)).filter((n) => n.length > 0);
        if (typeof value === 'string') {
            const trimmed = value.trim();
            if (!trimmed)
                return [];
            try {
                const parsed = JSON.parse(trimmed);
                if (Array.isArray(parsed))
                    return parsed.map((v) => String(v)).filter((n) => n.length > 0);
            }
            catch { }
            return trimmed.split(',').map((s) => String(s.trim())).filter((n) => n.length > 0);
        }
        return [];
    }),
    __metadata("design:type", Array)
], PlaylistSongDto.prototype, "songIds", void 0);
