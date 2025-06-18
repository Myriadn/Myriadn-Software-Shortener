"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const validations_1 = require("./validations");
const knex_1 = __importDefault(require("../config/knex"));
const encryption_1 = require("../config/encryption");
const jwt_1 = require("../config/jwt");
const getUser = (username) => __awaiter(void 0, void 0, void 0, function* () { return (0, knex_1.default)("users").whereRaw(`LOWER(username) = LOWER(?)`, [username]).first(); });
const register = (body) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validations_1.validateRegister)(body);
    const current_user = yield getUser(body.username);
    if (current_user) {
        throw new http_errors_1.default.Conflict("Username sudah terpakai");
    }
    const user = (yield (0, knex_1.default)("users").insert({
        username: body.username.toLocaleLowerCase(),
        password: yield (0, encryption_1.hashPassword)(body.password),
    }, ["id", "username"]))[0];
    return user;
});
exports.register = register;
const login = (body) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validations_1.validateLogin)(body);
    const user = yield getUser(body.username);
    if (!user) {
        throw new http_errors_1.default.Unauthorized("Username atau Password salah");
    }
    const passwordMatch = yield (0, encryption_1.comparePassword)(body.password, user.password);
    if (!passwordMatch) {
        throw new http_errors_1.default.Unauthorized("Username atau Password salah");
    }
    const token = yield (0, jwt_1.generateToken)({ id: user.id });
    return {
        user: {
            id: user.id,
            username: user.username,
            created_at: user.created_at,
            updated_at: user.updated_at,
        },
        token,
    };
});
exports.login = login;
