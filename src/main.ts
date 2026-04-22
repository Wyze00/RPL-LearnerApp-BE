import express from 'express';
import "dotenv/config"
import { errorMiddleware } from './middlewares/error.middleware.js';
import cookieParser from 'cookie-parser';
import { logMiddleware } from './middlewares/log.middleware.js';
import { logger } from './utils/winston.util.js';
import { TemplateRouter } from './routers/template.router.js';

import { AuthRouter, AuthRouterWithAuthentication } from './routers/auth.router.js';
import { EnrollmentRouter } from './routers/enrollment.router.js';
import { CourseRouter, CourseRouterWithAuth } from './routers/course.router.js';
import { InstructorRouter } from './routers/instructor.router.js';
import { AdminRouterWithAuth } from './routers/admin.router.js';


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
app.use('/api/auth/', AuthRouter.getRouter());
app.use('/api/auth/', AuthRouterWithAuthentication.getRouter());
app.use('/api/enrollments/', EnrollmentRouter.getRouter());
app.use('/api/courses/', CourseRouter.getRouter());
app.use('/api/courses/', CourseRouterWithAuth.getRouter());
app.use('/api/instructors/', InstructorRouter.getRouter());
app.use('/api/admin/', AdminRouterWithAuth.getRouter());
// Router

// Error middleware
app.use(errorMiddleware);

const port = process.env['PORT'] || '3000';

app.listen(port, () => {
    console.log('Application Start');
})