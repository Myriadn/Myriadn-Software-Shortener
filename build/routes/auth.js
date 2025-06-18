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
const router_1 = __importDefault(require("@koa/router"));
const users_1 = require("../services/users");
const authRouter = new router_1.default();
authRouter.post("/register", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.response.body = yield (0, users_1.register)(ctx.request.body);
})).post("/login", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.response.body = yield (0, users_1.login)(ctx.request.body);
}));
exports.default = authRouter;
