import { HttpException } from "./http.error.js";

export class BadRequestError extends HttpException {
    constructor(message: string) {
        super(400, message);
    }
}
