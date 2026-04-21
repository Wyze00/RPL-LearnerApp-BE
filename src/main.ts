import express from 'express';
import "dotenv/config"
import { errorMiddleware } from './middlewares/error.middleware.js';
import cookieParser from 'cookie-parser';
import { logMiddleware } from './middlewares/log.middleware.js';
import { logger } from './utils/winston.util.js';
import { TemplateRouter } from './routers/template.router.js';

export const app = express();

// Middleware
app.use(express.json());

const signedCookieKey = process.env['SIGNEDCOOKIEKEY'] || '';

if (signedCookieKey === '') {
    logger.error('Signed Cookie Key kosong');
    process.exit(1);
}

app.use(cookieParser(signedCookieKey));

// Logging middleware
app.use(logMiddleware);

// Router
app.use('/api/templates/', TemplateRouter.getRouter());
// Router

// Error middleware
app.use(errorMiddleware);

const port = process.env['PORT'] || '3000';

app.listen(port, () => {
    console.log('Application Start');
})