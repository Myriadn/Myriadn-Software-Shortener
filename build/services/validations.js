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
exports.validateLogin = exports.validateRegister = exports.validateUpdateShortURL = exports.validateCreateShortURL = void 0;
const validatorjs_1 = __importDefault(require("validatorjs"));
const http_errors_1 = __importDefault(require("http-errors"));
const validateBody = (body, validationSchema) => {
    let validation = new validatorjs_1.default(body, validationSchema);
    if (validation.fails()) {
        const errors = validation.errors.all();
        const aggregatedErrors = [];
        Object.keys(errors).forEach((key) => {
            aggregatedErrors.push(validation.errors.first(key));
        });
        throw new http_errors_1.default.BadRequest(aggregatedErrors.join(" , "));
    }
    else {
        return true;
    }
};
const validateCreateShortURL = (body) => __awaiter(void 0, void 0, void 0, function* () {
    return validateBody(body, {
        url: "url|required",
        id: "string|min:5|max:10|not_in:urls,visits,auth",
    });
});
exports.validateCreateShortURL = validateCreateShortURL;
const validateUpdateShortURL = (body) => __awaiter(void 0, void 0, void 0, function* () {
    return validateBody(body, {
        url: "url|required",
    });
});
exports.validateUpdateShortURL = validateUpdateShortURL;
const validateRegister = (body) => validateBody(body, {
    username: "string|required|min:4|max:8",
    password: "string|required|min:6",
});
exports.validateRegister = validateRegister;
const validateLogin = (body) => validateBody(body, {
    username: "string|required",
    password: "string|required",
});
exports.validateLogin = validateLogin;
