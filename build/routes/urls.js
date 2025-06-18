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
const urls_1 = require("../services/urls");
const urlsRouter = new router_1.default();
urlsRouter
    .get("/", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.response.body = yield (0, urls_1.getURLS)(ctx.state.user_id, Number(ctx.request.query.limit), Number(ctx.request.query.offset));
}))
    .post("/", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.response.body = yield (0, urls_1.createShortURL)(ctx.request.body, ctx.state.user_id);
}))
    .put("/:id", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.response.body = yield (0, urls_1.updateURL)(ctx.params.id, ctx.request.body, ctx.state.user_id);
}))
    .delete("/:id", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.response.body = yield (0, urls_1.deleteURL)(ctx.params.id, ctx.state.user_id);
}));
exports.default = urlsRouter;
