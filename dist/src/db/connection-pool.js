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
const MySql = require("mysql");
const READ_DB = 'read';
const WRITE_DB = 'write';
class ConnectionPool {
    constructor() {
        this.pools = new Map();
    }
    getConnection(type, autoCommit = true) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                if (this.pools == null || this.pools.get(type) == null) {
                    reject(new Error('No database configured'));
                }
                else {
                    let pool = this.pools.get(type);
                    if (pool != null) {
                        pool.getConnection((err, connection) => {
                            if (err) {
                                reject(err);
                            }
                            else {
                                if (autoCommit) {
                                    resolve(connection);
                                }
                                else {
                                    connection.beginTransaction((err) => {
                                        if (err) {
                                            reject(err);
                                        }
                                        resolve(connection);
                                    });
                                }
                            }
                        });
                    }
                    else {
                        reject(new Error(`No database configured of type ${type}`));
                    }
                }
            });
        });
    }
    initPools(config) {
        this.config = config;
        this.create(READ_DB, this.config);
        this.create(WRITE_DB, this.config);
    }
    create(type, config) {
        if (!config) {
            throw new Error('No configuration for the database');
        }
        this.pools.set(type, MySql.createPool({
            connectionLimit: config.connection_limit || 5,
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.database,
            port: config.port || 3306,
            debug: config.debug || false
        }));
    }
}
exports.ConnectionPool = ConnectionPool;
let pool = new ConnectionPool();
exports.pool = pool;

//# sourceMappingURL=connection-pool.js.map
