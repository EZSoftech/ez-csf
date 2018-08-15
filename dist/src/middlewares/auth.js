"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function authenticate(req, res, next) {
    let authToken = req.header('authorization');
    if (authToken) {
        next();
    }
    else {
        res.sendStatus(401);
    }
}
exports.authenticate = authenticate;

//# sourceMappingURL=auth.js.map
