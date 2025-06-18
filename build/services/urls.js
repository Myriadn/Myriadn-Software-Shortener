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
exports.getURLS = exports.deleteURL = exports.updateURL = exports.resolveURL = exports.createShortURL = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const knex_1 = __importDefault(require("../config/knex"));
const validations_1 = require("./validations");
const visits_1 = require("./visits");
const createShortURL = (body, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validations_1.validateCreateShortURL)(body);
    if (body.id) {
        const current_record = yield (0, knex_1.default)("urls").where({ id: body.id }).first();
        if (current_record) {
            throw new http_errors_1.default.Conflict("ID itu sudah ada di Database");
        }
    }
    const results = yield (0, knex_1.default)("urls").insert({ url: body.url, id: body.id, user_id }, "*");
    return results[0];
});
exports.createShortURL = createShortURL;
const resolveURL = (id, ip) => __awaiter(void 0, void 0, void 0, function* () {
    const url = yield (0, knex_1.default)("urls").where({ id }).select(["url"]).first();
    if (!url) {
        throw new http_errors_1.default.NotFound("URL tidak ditemukan");
    }
    yield (0, visits_1.registerVisit)(id, ip);
    return url.url;
});
exports.resolveURL = resolveURL;
const updateURL = (id, body, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validations_1.validateUpdateShortURL)(body);
    const url = yield (0, knex_1.default)("urls").where({ id }).select(["user_id"]).first();
    if (!url) {
        throw new http_errors_1.default.NotFound("URL tidak ditemukan");
    }
    if (url.user_id !== user_id) {
        throw new http_errors_1.default.Unauthorized("Kamu tidak diizinkan mengubah URL ini");
    }
    const results = yield (0, knex_1.default)("urls")
        .where({ id })
        .update({ url: body.url }, "*");
    return results[0];
});
exports.updateURL = updateURL;
const deleteURL = (id, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const url = yield (0, knex_1.default)("urls").where({ id }).select(["user_id"]).first();
    if (!url) {
        throw new http_errors_1.default.NotFound("URL tidak ditemukan");
    }
    if (url.user_id !== user_id) {
        throw new http_errors_1.default.Unauthorized("Kamu tidak diizinkan mengubah URL ini");
    }
    yield (0, knex_1.default)("urls").where({ id }).delete();
    return true;
});
exports.deleteURL = deleteURL;
const getURLS = (user_id, limit, offset) => __awaiter(void 0, void 0, void 0, function* () {
    const results = yield (0, knex_1.default)("urls")
        .where({ user_id })
        .leftJoin("visits", "urls.id", "visits.url_id")
        .select([
        "urls.id",
        "urls.url",
        "urls.created_at",
        knex_1.default.raw("count(visits.id) as visits_count"),
    ])
        .limit(limit || 15)
        .offset(offset || 0)
        .groupBy("urls.id")
        .orderBy("urls.created_at", "desc");
    return results;
});
exports.getURLS = getURLS;
