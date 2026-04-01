import express from 'express';
import "dotenv/config"
import {logRequestMiddleware } from './middlewares/log.middleware.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { AuthRouter } from './routers/auth.router.js';

const app = express();

app.use(logRequestMiddleware);

// Router

app.use('/auth', AuthRouter.getRouter());

// Router

app.use(errorMiddleware);

const port = process.env['PORT'];

app.listen(port, () => {
    console.log('Application Start');
})