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
const visits_1 = require("../services/visits");
const visitsRouter = new router_1.default();
visitsRouter
    .get("/", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.response.body = yield (0, visits_1.getLastVisits)(ctx.state.user_id, Number(ctx.query.limit), Number(ctx.query.offset));
}))
    .get("/:id", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.response.body = yield (0, visits_1.getVisitsByURL)(ctx.params.id, ctx.state.user_id, Number(ctx.query.limit), Number(ctx.query.offset));
}));
exports.default = visitsRouter;
