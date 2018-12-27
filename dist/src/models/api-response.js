"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiResponse {
    constructor(data, message = 'Success') {
        this.message = message;
        this.data = data ? Array.isArray(data) ? data : [data] : undefined;
    }
}
exports.ApiResponse = ApiResponse;

//# sourceMappingURL=api-response.js.map
