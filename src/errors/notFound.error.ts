import { HttpError } from "./http.error.js";

export class NotFoundException extends HttpError {

    constructor(message: string){
        super(404, message);
    }
}