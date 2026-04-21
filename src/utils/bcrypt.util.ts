import bcrypt from 'bcrypt'

export class BcryptUtil {
    static async hash (data: any): Promise<string> {
        return bcrypt.hash(data, 10);
    }

    static async compare (data: any, hash: string): Promise<boolean> {
        return bcrypt.compare(data, hash);
    }
}