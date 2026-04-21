import type { Request, Response, Router } from "express";
import express from 'express';
import { TemplateService } from "src/services/template.service.js";
import type { PostTemplateRequest } from "src/types/template.type.js";

export class TemplateRouter {
    private static router: Router

    static {
        this.router = express.Router(); 
        this.init();
    }

    static init() {

        this.router.get('/', async (req: Request, res: Response) => {

            const response = TemplateService.get();

            return res.status(200).json({
                data: response,
            })
        })

        this.router.post('/', async (req: Request, res: Response) => {
            const data = req.body as PostTemplateRequest;
            const response = TemplateService.post(data);

            return res.status(200).json({
                data: response,
            })
        })

    }

    static getRouter () {
        return this.router;
    }

}