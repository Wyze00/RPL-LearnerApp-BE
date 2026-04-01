import express from 'express';
import "dotenv/config"
import { errorMiddleware } from './middlewares/error.middleware.js';
import cookieParser from 'cookie-parser';
import { logRequestMiddleware } from './middlewares/log.middleware.js';

const app = express();

// 
app.use(express.json());
app.use(cookieParser());

// Logging middleware
app.use(logRequestMiddleware);

// Router

// Router

// Error middleware
app.use(errorMiddleware);

const port = process.env['PORT'];

app.listen(port, () => {
    console.log('Application Start');
})