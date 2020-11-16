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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.login = void 0;
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var _a = require('express'), Request = _a.Request, Response = _a.Response;
var sequelize = require('../models/index').sequelize;
var UserModel = require("../models").users;
/*
 * @function: login
 * function that handles /login request.
 * @params: req: Request object, res: Response object.
 */
var login = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, isMatch, token, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = req.body.credentials, email = _a.email, password = _a.password;
                return [4 /*yield*/, UserModel.findOne({
                        where: { email: email },
                        attributes: ['id', 'name', 'password'],
                    })];
            case 1:
                user = _b.sent();
                if (!user) return [3 /*break*/, 3];
                return [4 /*yield*/, bcrypt.compare(password, user.dataValues.password)];
            case 2:
                isMatch = _b.sent();
                if (isMatch) {
                    token = jwt.sign({ email: email }, process.env.SECRET_KEY, {
                        expiresIn: '24h',
                    });
                    delete user.dataValues.password;
                    res.json({ user: user, token: token });
                }
                else {
                    res.status(401);
                    res.json('Email or password invalid');
                    return [2 /*return*/, 'Password invalid'];
                }
                return [3 /*break*/, 4];
            case 3:
                res.status(401);
                res.json('Email or password invalid');
                return [2 /*return*/, 'Email or password invalid'];
            case 4: return [3 /*break*/, 6];
            case 5:
                error_1 = _b.sent();
                console.log(error_1);
                res.status(500);
                res.json(error_1.message);
                return [2 /*return*/, error_1];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.login = login;
/*
 * @function: register
 * function that handles /register request.
 * @params: req: Request object, res: Response object.
 */
var register = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, email, password, salt, hashedPassword, user, token, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body.credentials, name = _a.name, email = _a.email, password = _a.password;
                return [4 /*yield*/, bcrypt.genSalt(10)];
            case 1:
                salt = _b.sent();
                return [4 /*yield*/, bcrypt.hash(password, salt)];
            case 2:
                hashedPassword = _b.sent();
                return [4 /*yield*/, UserModel.create({
                        name: name,
                        email: email,
                        password: hashedPassword,
                        createdAt: sequelize.literal('CURRENT_TIMESTAMP'),
                        updatedAt: sequelize.literal('CURRENT_TIMESTAMP'),
                    }, { returning: true })];
            case 3:
                user = _b.sent();
                delete user.dataValues.password;
                delete user.dataValues.createdAt;
                delete user.dataValues.updatedAt;
                token = jwt.sign({ email: email }, process.env.SECRET_KEY, {
                    expiresIn: '24h',
                });
                return [2 /*return*/, res.json({ user: user, token: token })];
            case 4:
                error_2 = _b.sent();
                console.log(error_2);
                res.status(500);
                res.json(error_2.message);
                return [2 /*return*/, error_2];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.register = register;
