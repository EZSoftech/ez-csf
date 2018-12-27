export class AppError extends Error {

    status: number;
    message: string;

    constructor(status: number, message: string) {
        super(message);
        this.message = message;
        this.status = status;
    }

    toJSON(): any {
        return {
            status: this.status,
            message: this.message
        };
    }

}
