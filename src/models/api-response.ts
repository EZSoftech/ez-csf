export class ApiResponse {
    message: string;
    data: Array<any>;
    constructor(data?: Array<any> | any, message = 'Success') {
        this.message = message;
        this.data = data ? Array.isArray(data) ? data : [data] : undefined;
    }
}
