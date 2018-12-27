"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_pool_1 = require("./connection-pool");
const READ_DB = 'read';
const WRITE_DB = 'write';
class DbUtil {
    constructor(connection) {
        this.connection = connection;
    }
    query(query, values) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if (!this.connection) {
                        this.connection = yield this.getConnection(true);
                    }
                    this.connection.query(query, values, (err, results, fields) => {
                        if (err) {
                            reject(err);
                        }
                        this.connection.release();
                        resolve({ results: results, fields: fields });
                    });
                }
                catch (error) {
                    reject(error);
                }
            }));
        });
    }
    commit() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                if (this.connection) {
                    this.connection.commit((err) => {
                        if (err) {
                            reject(err);
                        }
                        this.connection.release();
                        resolve(true);
                    });
                }
                else {
                    reject(new Error('No Connection found'));
                }
            });
        });
    }
    rollback() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                if (this.connection) {
                    this.connection.rollback((err) => {
                        if (err) {
                            reject(err);
                        }
                        this.connection = null;
                        resolve(true);
                    });
                }
                else {
                    reject(new Error('No Connection found'));
                }
            });
        });
    }
    insert(query, values, autoCommit = true) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if (!this.connection) {
                        this.connection = yield this.getConnection(autoCommit);
                    }
                    this.connection.query(query, values, (err, results, fields) => {
                        if (err) {
                            reject(err);
                        }
                        if (autoCommit) {
                            this.connection.release();
                        }
                        resolve(results);
                    });
                }
                catch (error) {
                    reject(error);
                }
            }));
        });
    }
    getConnection(autoCommit) {
        return __awaiter(this, void 0, void 0, function* () {
            let connection;
            try {
                connection = yield connection_pool_1.pool.getConnection(READ_DB, autoCommit);
            }
            catch (error) {
                throw error;
            }
            return connection;
        });
    }
}
exports.DbUtil = DbUtil;

//# sourceMappingURL=db-util.js.map
