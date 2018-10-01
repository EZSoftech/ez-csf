"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_util_1 = require("../utils/auth-util");
function authenticate(req, res, next) {
    auth_util_1.AppUtil.verifyToken(req);
    next();
}
exports.authenticate = authenticate;

//# sourceMappingURL=auth.js.map
