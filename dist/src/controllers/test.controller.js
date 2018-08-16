"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connection_pool_1 = require("../db/connection-pool");
function get(req, res, next) {
    connection_pool_1.pool.getConnection('db').then((conn) => {
        conn.query('SELECT * FROM ezi_user', (err, result, fields) => {
            if (err) {
                next(err);
            }
            conn.release();
            res.json(result.map(item => {
                delete item.password;
                return item;
            }));
        });
    }, (err) => {
        next(err);
    });
}
exports.get = get;

//# sourceMappingURL=test.controller.js.map
