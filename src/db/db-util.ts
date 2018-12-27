import * as MySql from 'mysql';
import { pool } from './connection-pool';

const READ_DB = 'read';
const WRITE_DB = 'write';

export class DbUtil {

    connection: MySql.PoolConnection;

    constructor(connection?: MySql.PoolConnection) {
        this.connection = connection;
    }

    async query(query: string, values: Array<any>): Promise<QueryResult> {
        return new Promise<QueryResult>(async (resolve: (results: QueryResult) => void, reject: (err: Error) => void) => {
            try {
                if (!this.connection) {
                    this.connection = await this.getConnection(true);
                }
                this.connection.query(query, values, (err: Error, results: any, fields: MySql.FieldInfo[]) => {
                    if (err) {
                        reject(err);
                    }
                    this.connection.release();
                    resolve({ results: results, fields: fields });
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    async commit(): Promise<boolean> {
        return new Promise<boolean>((resolve: (status: boolean) => void, reject: (err: Error) => void) => {
            if (this.connection) {
                this.connection.commit((err) => {
                    if (err) {
                        reject(err);
                    }
                    this.connection.release();
                    resolve(true);
                });
            } else {
                reject(new Error('No Connection found'));
            }
        });
    }

    async rollback(): Promise<boolean> {
        return new Promise<boolean>((resolve: (status: boolean) => void, reject: (err: Error) => void) => {
            if (this.connection) {
                this.connection.rollback((err) => {
                    if (err) {
                        reject(err);
                    }
                    this.connection = null;
                    resolve(true);
                });
            } else {
                reject(new Error('No Connection found'));
            }
        });
    }

    async insert(query: string, values: Array<any>, autoCommit = true): Promise<any> {
        return new Promise<any>(async (resolve: (results: any) => void, reject: (err: Error) => void) => {
            try {
                if (!this.connection) {
                    this.connection = await this.getConnection(autoCommit);
                }
                this.connection.query(query, values, (err: Error, results: any, fields: MySql.FieldInfo[]) => {
                    if (err) {
                        reject(err);
                    }
                    if (autoCommit) {
                        this.connection.release();
                    }
                    resolve(results);
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    private async getConnection(autoCommit?: boolean): Promise<MySql.PoolConnection> {
        let connection: MySql.PoolConnection;
        try {
            connection = await pool.getConnection(READ_DB, autoCommit);
        } catch (error) {
            throw error;
        }
        return connection;
    }

}

export interface QueryResult {
    results?: any;
    fields?: MySql.FieldInfo[];
}

export interface InsertResult {
    affectedRows?: number;
    changedRows?: number;
    fieldCount?: number;
    insertId: number;
    message?: string;
    protocol41?: boolean;
    serverStatus?: number;
    warningCount?: number;
}
