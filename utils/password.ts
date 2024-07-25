import bcrypt from 'bcrypt';

export const hashPassword = async (password: string) => {
    const saltRounds = 8;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    return hashedPassword;
}

/**
 * 
 * @param password - plain password
 * @param hashedPassword - hashed password
 */
export const matchPassword = async (password: string, hashedPassword: string) => {
    const isMatch = await bcrypt.compare(password, hashedPassword)

    return isMatch;
}