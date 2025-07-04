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
require("dotenv/config");
const koa_1 = __importDefault(require("koa"));
const cors_1 = __importDefault(require("@koa/cors"));
const koa_helmet_1 = __importDefault(require("koa-helmet"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const knex_1 = require("./config/knex");
const index_1 = __importDefault(require("./routes/index"));
const app = new koa_1.default();
app.use((0, cors_1.default)());
app.use((0, koa_helmet_1.default)());
app.use((0, koa_bodyparser_1.default)());
app.use(index_1.default.routes()).use(index_1.default.allowedMethods());
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, knex_1.onDatabaseConnect)();
        console.log("Connected :)");
        // Database is Ready
        app.listen(Number(process.env.PORT), () => console.log(`Server started with port ${process.env.PORT}`));
    }
    catch (e) {
        console.log(e);
    }
});
main();
