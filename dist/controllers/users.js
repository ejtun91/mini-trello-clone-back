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
exports.currentUser = exports.login = exports.register = void 0;
require("dotenv/config");
const user_1 = __importDefault(require("../models/user"));
const mongoose_1 = require("mongoose");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const normalizeUser = (user) => {
    const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.SECRET);
    return {
        email: user.email,
        username: user.username,
        id: user.id,
        token: `Bearer ${token}`,
    };
};
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = new user_1.default({
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
        });
        const savedUser = yield newUser.save();
        res.send(normalizeUser(savedUser));
    }
    catch (error) {
        if (error instanceof mongoose_1.Error.ValidationError) {
            const messages = Object.values(error.errors).map((err) => err.message);
            return res.status(422).json(messages);
        }
        next(error);
    }
});
exports.register = register;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findOne({ email: req.body.email }).select("+password");
        const errors = { emailOrPassword: "Incorrect email or password" };
        if (!user) {
            return res.status(422).json(errors);
        }
        const isSamePassword = yield user.validatePassword(req.body.password);
        if (!isSamePassword) {
            return res.status(422).json(errors);
        }
        res.send(normalizeUser(user));
    }
    catch (error) {
        next(error);
    }
});
exports.login = login;
const currentUser = (req, res) => {
    if (!req.user) {
        return res.sendStatus(401);
    }
    res.send(normalizeUser(req.user));
};
exports.currentUser = currentUser;
//# sourceMappingURL=users.js.map