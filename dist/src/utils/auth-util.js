"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const randToken = require("rand-token");
const ezi_error_1 = require("../models/ezi-error");
const JWT_SECRET = 'Secret';
const BEARER = 'Bearer ';
function generateAccessToken(payload) {
    return jwt.sign(payload, JWT_SECRET);
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
        throw new ezi_error_1.EZIError(401, 'Auth Token is missing');
    }
    try {
        let decoded = jwt.verify(authToken, JWT_SECRET);
        console.log(decoded);
    }
    catch (err) {
        throw err;
    }
}
const AppUtil = {
    generateAccessToken: generateAccessToken,
    generateRefreshToken: generateRefreshToken,
    verifyToken: verifyToken
};
exports.AppUtil = AppUtil;

//# sourceMappingURL=auth-util.js.map
