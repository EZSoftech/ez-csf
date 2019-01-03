import * as jwt from 'jsonwebtoken';
import * as randToken from 'rand-token';
import { ApiRequest } from '../models/api-request';
import { AppError } from '../models/app-error';
import { AppUser } from '@ezsoftech/common-objects';

const JWT_SECRET = 'Secret';
const BEARER = 'Bearer ';

const TOKEN_USER_MAP = new Map<string, any>();

function generateAccessToken(payload: any): string {
  let accessToken = jwt.sign(payload, JWT_SECRET);
  TOKEN_USER_MAP.set(accessToken, payload);
  return accessToken;
}

function generateRefreshToken(): string {
  return randToken.uid(256);
}

function verifyToken(req: ApiRequest): void {
  let authorization = req.header('authorization');
  let authToken: string;
  if (authorization) {
    authToken = authorization.split(BEARER)[1];
  } else {
    throw new AppError(401, 'Auth Token is missing');
  }
  try {
    let decoded = jwt.verify(authToken, JWT_SECRET);
    updateAuthorizeUser(req, authToken);
    console.log(decoded);
  } catch (err) {
    throw err;
  }
}

function getUserInfo(authToken: string): AppUser {
  let appUser: AppUser;
  try {
    appUser = jwt.verify(authToken, JWT_SECRET) as AppUser;
  } catch (error) {
    throw error;
  }
  return appUser;
}

function updateAuthorizeUser(req: ApiRequest, authToken: string): void {
  req.authorizeUser = TOKEN_USER_MAP.get(authToken) as AppUser;
}

function toPlainObject<T>(obj: any): T {
  let plainObject: T = {} as T;
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

export { AppUtil };
