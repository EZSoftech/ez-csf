import * as MySql from 'mysql';
import * as Promise from 'bluebird';

const READ_DB = 'read';
const WRITE_DB = 'write';

export class ConnectionPool {

    private pools: Map<string, MySql.Pool>;
    private config: any;

    constructor() {
        this.pools = new Map();
    }

    getConnection(type: string): Promise<MySql.PoolConnection> {
        return new Promise<MySql.PoolConnection>((resolve: (connection: MySql.PoolConnection) => void, reject: (error: any) => void) => {
            if (this.pools == null || this.pools.get(type) == null) {
                reject(new Error('No database configured'));
            } else {
                let pool = this.pools.get(type);
                if (pool != null) {
                    pool.getConnection((err: MySql.MysqlError, connection: MySql.PoolConnection) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(connection);
                        }
                    });
                } else {
                    reject(new Error(`No database configured of type ${type}`));
                }
            }
        });
    }

    initPools(config: any): void {
        this.config = config;
        this.create(READ_DB, this.config);
        this.create(WRITE_DB, this.config);
    }

    private create(type: string, config: any): void {
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

let pool = new ConnectionPool();
export { pool };
