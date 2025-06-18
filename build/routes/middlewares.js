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
exports.requireAuthHandler = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const jwt_1 = require("../config/jwt");
const requireAuthHandler = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const header = ctx.request.headers.authorization;
    if (!header) {
        throw new http_errors_1.default.Unauthorized("Tolong berikan token");
    }
    const token = header.split(" ")[1];
    const tokenPayLoad = yield (0, jwt_1.validateJWT)(token);
    ctx.state.user_id = tokenPayLoad.id;
    yield next();
});
exports.requireAuthHandler = requireAuthHandler;
