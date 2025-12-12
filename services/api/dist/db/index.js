"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const mysql2_1 = require("drizzle-orm/mysql2");
const env_1 = __importDefault(require("@yukikaze/lib/create-env"));
const fs_1 = __importDefault(require("fs"));
const schema = __importStar(require("./schemas"));
const createMysqlClient = () => {
    const connection = promise_1.default.createPool({
        host: env_1.default.MYSQL_HOST,
        port: env_1.default.MYSQL_PORT,
        user: env_1.default.MYSQL_USER,
        password: env_1.default.MYSQL_PASSWORD,
        database: env_1.default.MYSQL_DATABASE,
        ssl: {
            ca: fs_1.default.readFileSync('ca.pem'),
            rejectUnauthorized: true
        },
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
    });
    return (0, mysql2_1.drizzle)(connection, { casing: "snake_case", mode: "default", schema });
};
const globalForDrizzle = globalThis;
exports.db = globalForDrizzle.db ?? createMysqlClient();
if (env_1.default.NODE_ENV !== "production")
    globalForDrizzle.db = exports.db;
__exportStar(require("drizzle-orm"), exports);
