"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connection_pool_1 = require("../db/connection-pool");
function getNavigationLinks(req, res, next) {
    connection_pool_1.pool.getConnection('db').then((connection) => {
        console.log(connection);
    });
    res.json({ success: true });
}
exports.getNavigationLinks = getNavigationLinks;

//# sourceMappingURL=nav-links.controller.js.map
