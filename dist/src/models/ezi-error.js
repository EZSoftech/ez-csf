"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EZIError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}
exports.EZIError = EZIError;

//# sourceMappingURL=ezi-error.js.map
