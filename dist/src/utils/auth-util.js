"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const randToken = require("rand-token");
const app_error_1 = require("../models/app-error");
const JWT_SECRET = 'Secret';
const BEARER = 'Bearer ';
const TOKEN_USER_MAP = new Map();
function generateAccessToken(payload) {
    let accessToken = jwt.sign(payload, JWT_SECRET);
    TOKEN_USER_MAP.set(accessToken, payload);
    return accessToken;
}
function generateRefreshToken() {
    return randToken.uid(256);
}
function verifyToken(req) {
    let authorization = req.header('authorization');
    let authToken;
    if (authorization) {
        authToken = authorization.split(BEARER)[1];
    }
    else {
        throw new app_error_1.AppError(401, 'Auth Token is missing');
    }
    try {
        let decoded = jwt.verify(authToken, JWT_SECRET);
        updateAuthorizeUser(req, authToken);
        console.log(decoded);
    }
    catch (err) {
        throw err;
    }
}
function updateAuthorizeUser(req, authToken) {
    req.authorizeUser = TOKEN_USER_MAP.get(authToken);
}
function toPlainObject(obj) {
    let plainObject = {};
    for (let k in obj) {
        if (obj[k]) {
            plainObject[k] = obj[k];
        }
    }
    return plainObject;
}
const AppUtil = {
    generateAccessToken: generateAccessToken,
    generateRefreshToken: generateRefreshToken,
    verifyToken: verifyToken,
    toPlainObject: toPlainObject
};
exports.AppUtil = AppUtil;

//# sourceMappingURL=auth-util.js.map
