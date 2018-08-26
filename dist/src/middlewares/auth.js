"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BEARER = 'Bearer ';
function authenticate(req, res, next) {
    let authorization = req.header('authorization');
    let authToken = authorization.split(BEARER)[1];
    if (authToken) {
        next();
    }
    else {
        res.json({
            message: 'Unauthorized'
        });
    }
}
exports.authenticate = authenticate;

//# sourceMappingURL=auth.js.map
