"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use((req, res, next) => {
    const user_id = "10";
    req.user_id = user_id;
    next();
});
app.get("/", (req, res, next) => {
    res.send(req.user_id);
});
app.listen(process.env.PORT, () => console.log(`Connected to ${process.env.PORT}`));
