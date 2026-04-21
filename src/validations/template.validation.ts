import type { PostTemplateRequest } from "src/types/template.type.js";
import z, { type ZodType } from "zod";

export class TemplateValidation {
    static POSTREQUEST: ZodType<PostTemplateRequest> = z.object({
        name: z.string().min(1, 'Minimal nama 1 karakter').max(50, 'Maximal nama 50 karakter')
    })
}