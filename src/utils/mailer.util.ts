import nodemailer from 'nodemailer';
import 'dotenv/config';
import { logger } from './winston.util.js';

const EMAIL = process.env['EMAIL_ACCOUNT'];
const EMAIL_PASS = process.env['EMAIL_PASSWORD'];

export const mailer = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: EMAIL,
        pass: EMAIL_PASS,
    }
});

try {
    await mailer.verify();
} catch (error) {
    logger.error('Node Mailer Gagal Verify');
    process.exit(1);
}