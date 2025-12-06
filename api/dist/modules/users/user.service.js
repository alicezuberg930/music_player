"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../../db");
const schemas_1 = require("../../db/schemas");
const exceptions_1 = require("../../lib/exceptions");
const password_1 = require("../../lib/bcrypt/password");
const env_1 = __importDefault(require("../../lib/helpers/env"));
const utils_1 = require("../../db/utils");
const email_1 = __importDefault(require("../../lib/email"));
class UserService {
    async getUsers(request, response) {
        try {
            // const { } = request.query
            const data = await db_1.db.query.users.findMany({});
            return response.json({ message: 'User details fetched successfully', data });
        }
        catch (error) {
            if (error instanceof exceptions_1.HttpException)
                throw error;
            throw new exceptions_1.BadRequestException(error instanceof Error ? error.message : undefined);
        }
    }
    async signIn(request, response) {
        try {
            const { email, password } = request.body;
            const user = await db_1.db.query.users.findFirst({ where: (0, db_1.eq)(schemas_1.users.email, email) });
            if (!user)
                throw new exceptions_1.NotFoundException('User not found');
            const isPasswordValid = await new password_1.Password().verify(user.password, password);
            if (!isPasswordValid)
                throw new exceptions_1.BadRequestException('Invalid password');
            // Generate JWT access token
            const token = jsonwebtoken_1.default.sign({ id: user.id }, env_1.default.JWT_SECRET, { expiresIn: '1d', algorithm: 'HS256' });
            response.cookie('accessToken', token, {
                httpOnly: true,
                secure: env_1.default.NODE_ENV === "production", // Required for HTTPS
                sameSite: env_1.default.NODE_ENV === "production" ? 'lax' : 'strict', // Required for cross-domain cookies
                domain: env_1.default.NODE_ENV === "production" ? '.tien-music-player.site' : undefined, // Share cookie across subdomains
                maxAge: 1 * 24 * 60 * 60 * 1000 // 1 day
            });
            return response.json({
                message: 'User logged in successfully',
                data: { user, accessToken: token }
            });
        }
        catch (error) {
            if (error instanceof exceptions_1.HttpException)
                throw error;
            throw new exceptions_1.BadRequestException(error instanceof Error ? error.message : undefined);
        }
    }
    async signUp(request, response) {
        try {
            const { password, fullname, email } = request.body;
            const existingUser = await db_1.db.query.users.findFirst({ where: (0, db_1.eq)(schemas_1.users.email, email) });
            if (existingUser)
                throw new exceptions_1.BadRequestException('Email is already registered');
            const hashedPassword = await new password_1.Password().hash(password);
            const verifyToken = await new password_1.Password().hash((0, utils_1.createId)());
            const verifyTokenExpires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour from now
            const user = await db_1.db.insert(schemas_1.users).values({ fullname, email, password: hashedPassword, verifyToken, verifyTokenExpires }).$returningId();
            const verifyLink = `${env_1.default.WEB_URL}/verify/${user[0].id}?token=${verifyToken}`;
            (0, email_1.default)({
                to: email,
                subject: 'Verify Your Email - Yukikaze Music Player',
                template: 'VerifyEmail',
                data: { username: fullname, verifyLink }
            })
                .then(_ => console.log('Verification email sent successfully'))
                .catch(err => console.error('Failed to send verification email:', err));
            const token = jsonwebtoken_1.default.sign({ id: user[0].id }, env_1.default.JWT_SECRET, { expiresIn: '1d', algorithm: 'HS256' });
            response.cookie('accessToken', token, {
                httpOnly: true,
                secure: env_1.default.NODE_ENV === "production", // Required for HTTPS
                sameSite: env_1.default.NODE_ENV === "production" ? 'lax' : 'strict', // Required for cross-domain cookies
                domain: env_1.default.NODE_ENV === "production" ? '.tien-music-player.site' : undefined, // Share cookie across subdomains
                maxAge: 1 * 24 * 60 * 60 * 1000 // 1 day
            });
            return response.status(201).json({ message: 'User registered successfully' });
        }
        catch (error) {
            if (error instanceof exceptions_1.HttpException)
                throw error;
            throw new exceptions_1.BadRequestException(error instanceof Error ? error.message : undefined);
        }
    }
    async findUser(request, response) {
        try {
            const { id } = request.params;
            const data = await db_1.db.query.users.findFirst({
                columns: { password: false },
                where: (0, db_1.eq)(schemas_1.users.id, id),
                with: { songs: true, playlists: true }
            });
            if (!data)
                throw new exceptions_1.NotFoundException('User not found');
            return response.json({ message: 'User details fetched successfully', data });
        }
        catch (error) {
            if (error instanceof exceptions_1.HttpException)
                throw error;
            throw new exceptions_1.BadRequestException(error instanceof Error ? error.message : undefined);
        }
    }
    async myProfile(request, response) {
        try {
            if (!request.userId)
                throw new exceptions_1.BadRequestException('User ID is missing in request');
            const data = await db_1.db.query.users.findFirst({
                where: (0, db_1.eq)(schemas_1.users.id, request.userId),
                columns: { password: false }
            });
            if (!data)
                throw new exceptions_1.NotFoundException('User not found');
            response.set('Cache-Control', 'public, max-age=0, must-revalidate');
            return response.json({ message: 'User details fetched successfully', data });
        }
        catch (error) {
            if (error instanceof exceptions_1.HttpException)
                throw error;
            throw new exceptions_1.BadRequestException(error instanceof Error ? error.message : undefined);
        }
    }
    async signOut(_, response) {
        try {
            response.clearCookie('accessToken', {
                httpOnly: true,
                secure: env_1.default.NODE_ENV === "production", // Required for HTTPS
                sameSite: env_1.default.NODE_ENV === "production" ? 'lax' : 'strict', // Required for cross-domain cookies
                domain: env_1.default.NODE_ENV === "production" ? '.tien-music-player.site' : undefined, // Share cookie across subdomains
            });
            return response.json({ message: 'User signed out successfully' });
        }
        catch (error) {
            if (error instanceof exceptions_1.HttpException)
                throw error;
            throw new exceptions_1.BadRequestException(error instanceof Error ? error.message : undefined);
        }
    }
    async updateUser(request, response) {
        try {
            const { id } = request.params;
            const { fullname, email, password } = request.body;
            return response.json({ message: 'User updated successfully', data: { id, fullname, email, password } });
        }
        catch (error) {
            if (error instanceof exceptions_1.HttpException)
                throw error;
            throw new exceptions_1.BadRequestException(error instanceof Error ? error.message : undefined);
        }
    }
    async verifyEmail(request, response) {
        try {
            const { id } = request.params;
            const { token } = request.query;
            const user = await db_1.db.query.users.findFirst({ where: (0, db_1.and)((0, db_1.eq)(schemas_1.users.id, id)) });
            if (!user)
                throw new exceptions_1.NotFoundException('User not found');
            if (user.isVerified)
                return response.json({ message: 'Email is already verified' });
            if (user.verifyToken && user.verifyToken !== token)
                throw new exceptions_1.BadRequestException('Invalid verification token');
            if (user.verifyTokenExpires && user.verifyTokenExpires < new Date())
                throw new exceptions_1.BadRequestException('Verification token has expired');
            await db_1.db.update(schemas_1.users).set({ isVerified: true, verifyToken: null, verifyTokenExpires: null }).where((0, db_1.eq)(schemas_1.users.id, user.id));
            return response.json({ message: 'Email verified successfully' });
        }
        catch (error) {
            if (error instanceof exceptions_1.HttpException)
                throw error;
            throw new exceptions_1.BadRequestException(error instanceof Error ? error.message : undefined);
        }
    }
    async userSongs(request, response) {
        try {
            if (!request.userId)
                throw new exceptions_1.BadRequestException('User ID is missing in request');
            const data = await db_1.db.query.songs.findMany({ where: (0, db_1.eq)(schemas_1.songs.userId, request.userId) });
            return response.json({ message: 'User songs fetched successfully', data });
        }
        catch (error) {
            if (error instanceof exceptions_1.HttpException)
                throw error;
            throw new exceptions_1.BadRequestException(error instanceof Error ? error.message : undefined);
        }
    }
}
exports.UserService = UserService;
