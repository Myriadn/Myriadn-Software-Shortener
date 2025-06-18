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
exports.getVisitsByURL = exports.getLastVisits = exports.registerVisit = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const knex_1 = __importDefault(require("../config/knex"));
const registerVisit = (url_id, ip) => __awaiter(void 0, void 0, void 0, function* () { return (0, knex_1.default)("visits").insert({ url_id, ip }); });
exports.registerVisit = registerVisit;
const getLastVisits = (user_id, limit, offset) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, knex_1.default)("visits")
        .join("urls", "urls.id", "visits.url_id")
        .select(["urls.id", "urls.url", "visits.ip", "visits.created_at"])
        .where({ user_id })
        .limit(limit || 15)
        .offset(offset || 6)
        .orderBy("visits.created_at", "desc");
});
exports.getLastVisits = getLastVisits;
const getVisitsByURL = (url_id, user_id, limit, offset) => __awaiter(void 0, void 0, void 0, function* () {
    const url = yield (0, knex_1.default)("url")
        .where({ id: url_id })
        .select(["user_id"])
        .first();
    if (!url) {
        throw new http_errors_1.default.NotFound("URL tidak ditemukan");
    }
    if (url.user_id !== user_id) {
        throw new http_errors_1.default.Unauthorized("Kamu tidak diizinkan mengubah URL ini");
    }
    return (0, knex_1.default)("visits")
        .where({ url_id })
        .limit(limit || 15)
        .offset(offset || 0)
        .orderBy("created_at", "desc");
});
exports.getVisitsByURL = getVisitsByURL;
