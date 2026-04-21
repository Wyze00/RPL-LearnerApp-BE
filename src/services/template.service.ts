import type { Template } from "prisma/generated/client.js";
import type { PostTemplateRequest } from "src/types/template.type.js";
import { prismaClient } from "src/utils/prisma.util.js";
import { ZodUtil } from "src/utils/zod.util.js";
import { TemplateValidation } from "src/validations/template.validation.js";

export class TemplateService {

    static get(): string {
        return 'GET';
    }

    static async post(data: PostTemplateRequest) {
        const validatedData = ZodUtil.validate(data, TemplateValidation.POSTREQUEST);

        const template: Template = await prismaClient.template.create({
            data: {
                name: validatedData.name,
            }
        })

        return this.mapTemplate(template);
    }

    static mapTemplate(template: Template) {
        return {
            name: template.name,
        }
    }
}