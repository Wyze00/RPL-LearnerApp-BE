import jwt from 'jsonwebtoken';
import 'dotenv/config'
import { logger } from './winston.util.js';

export class JwtUtil {
    private static SECRET: string = process.env['JWTKEY'] || '';

    static {
        if (this.SECRET === '') {
            logger.error('Jwt secret key kosong');
            process.exit(1);
        } 
    }

    static async sign (data: string | object): Promise<string> {
        return jwt.sign(data, JwtUtil.SECRET, {
            expiresIn: '1h'
        });
    }

    static async verify (token: string): Promise<any> {
        return jwt.verify(token, JwtUtil.SECRET);
    }
}