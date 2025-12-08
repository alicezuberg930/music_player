"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_service_1 = require("./user.service");
class UserController {
    constructor() {
        this.userService = new user_service_1.UserService();
    }
    async getUsers(request, response) {
        return await this.userService.getUsers(request, response);
    }
    async signUp(request, response) {
        return await this.userService.signUp(request, response);
    }
    async signIn(request, response) {
        return await this.userService.signIn(request, response);
    }
    async signOut(request, response) {
        return await this.userService.signOut(request, response);
    }
    async findUser(request, response) {
        return await this.userService.findUser(request, response);
    }
    async myProfile(request, response) {
        return await this.userService.myProfile(request, response);
    }
    async updateUser(request, response) {
        return await this.userService.updateUser(request, response);
    }
    async verifyEmail(request, response) {
        return await this.userService.verifyEmail(request, response);
    }
    async userSongs(request, response) {
        return await this.userService.userSongs(request, response);
    }
    async userPlaylists(request, response) {
        return await this.userService.userPlaylists(request, response);
    }
    async addFavoriteSong(request, response) {
        return await this.userService.addFavoriteSong(request, response);
    }
    async removeFavoriteSong(request, response) {
        return await this.userService.removeFavoriteSong(request, response);
    }
    async addFavoritePlaylist(request, response) {
        return await this.userService.addFavoritePlaylist(request, response);
    }
    async removeFavoritePlaylist(request, response) {
        return await this.userService.removeFavoritePlaylist(request, response);
    }
}
exports.default = new UserController();
