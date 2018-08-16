"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MySql = require("mysql");
const Promise = require("bluebird");
const READ_DB = 'read';
const WRITE_DB = 'write';
class ConnectionPool {
    constructor() {
        this.pools = new Map();
    }
    getConnection(type) {
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
                            resolve(connection);
                        }
                    });
                }
                else {
                    reject(new Error(`No database configured of type ${type}`));
                }
            }
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
