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
const auth_1 = __importDefault(require("./auth"));
const urls_1 = __importDefault(require("./urls"));
const middlewares_1 = require("./middlewares");
const visits_1 = __importDefault(require("./visits"));
const urls_2 = require("../services/urls");
const router = new router_1.default();
router.use("/auth", auth_1.default.routes(), auth_1.default.allowedMethods());
router.use("/urls", middlewares_1.requireAuthHandler, urls_1.default.routes(), urls_1.default.allowedMethods());
router.use("/visits", middlewares_1.requireAuthHandler, visits_1.default.routes(), visits_1.default.allowedMethods());
router.get("/:id", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const url = yield (0, urls_2.resolveURL)(ctx.params.id, ctx.request.ip);
    ctx.redirect(url);
}));
exports.default = router;
