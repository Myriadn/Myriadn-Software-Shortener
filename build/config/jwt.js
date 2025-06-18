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
exports.validateJWT = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_errors_1 = __importDefault(require("http-errors"));
const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;
const generateToken = (payload) => __awaiter(void 0, void 0, void 0, function* () { return jsonwebtoken_1.default.sign(payload, JWT_PRIVATE_KEY, { expiresIn: "365d" }); });
exports.generateToken = generateToken;
const validateJWT = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const content = jsonwebtoken_1.default.verify(token, JWT_PRIVATE_KEY);
        return content;
    }
    catch (e) {
        throw new http_errors_1.default.Unauthorized("Tolong berikan token yang valid");
    }
});
exports.validateJWT = validateJWT;
