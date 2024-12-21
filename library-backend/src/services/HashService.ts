import bcrypt from "bcryptjs";

class HashService {
    public static async hashPassword(password: string): Promise<string> {
        try {
            const salt = await bcrypt.genSalt(10);
            return await bcrypt.hash(password, salt);
        }
        catch (error: unknown) {
            if(error instanceof Error) {
                throw new Error('Error creating HashService' + error.message);
            } else {
                throw error;
            }
        }
    }

    public static async  comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        try {
            return await bcrypt.compare(password, hashedPassword);
        }
        catch (error: unknown) {
            if(error instanceof Error) {
                throw new Error('Error comparing HashService' + error.message);
            } else {
                throw error;
            }
        }
    }
}

export default HashService;