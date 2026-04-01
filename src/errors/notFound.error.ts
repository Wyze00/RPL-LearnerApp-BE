import { HttpException } from "./http.error.js";

export class NotFoundException extends HttpException {
    constructor(message: string){
        super(404, message);
    }
}