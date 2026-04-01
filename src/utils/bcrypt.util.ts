import bcrypt from 'bcrypt'
import { logger } from './winston.util.js';

export class BcryptUtil {
    private static SECRET: string = process.env['BCRYPTKEY'] || '';

    static {
        if (this.SECRET === '') {
            logger.error('Bcrypt secret key kosong');
            process.exit(0);
        } 
    }

    static async hash (data: any): Promise<string> {
        return bcrypt.hash(data, this.SECRET);
    }

    static async compare (data: any, hash: string): Promise<boolean> {
        return bcrypt.compare(data, hash);
    }
}