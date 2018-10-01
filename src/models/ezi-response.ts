import { Response } from 'express';

export interface EZIResponse extends Response {
    message: string;
    data: Array<any>;
}
