import * as jwt from 'jsonwebtoken';
import * as randToken from 'rand-token';
import { EZIRequest } from '../models/ezi-request';
import { EZIError } from '../models/ezi-error';
import { EZIUserInfo } from '../models/ezi-user-info';

const JWT_SECRET = 'Secret';
const BEARER = 'Bearer ';

function generateAccessToken(payload: any): string {
    return jwt.sign(payload, JWT_SECRET);
}

function generateRefreshToken(): string {
    return randToken.uid(256);
}

function verifyToken(req: EZIRequest): void {
    let authorization = req.header('authorization');
    let authToken;
    if (authorization) {
        authToken = authorization.split(BEARER)[1];
    } else {
        throw new EZIError(401, 'Auth Token is missing');
    }
    try {
        let decoded = jwt.verify(authToken, JWT_SECRET);
        console.log(decoded);
    } catch (err) {
        throw err;
    }
}

const AppUtil = {
    generateAccessToken: generateAccessToken,
    generateRefreshToken: generateRefreshToken,
    verifyToken: verifyToken
};

export { AppUtil };
