"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppError extends Error {
    constructor(status, message) {
        super(message);
        this.message = message;
        this.status = status;
    }
    toJSON() {
        return {
            status: this.status,
            message: this.message
        };
    }
}
exports.AppError = AppError;

//# sourceMappingURL=app-error.js.map
