import { SignJWT, jwtVerify } from 'jose';
import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-encryption-key';
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;

export const generateNonce = () => {
    return randomBytes(32).toString('hex');
};

export const encryptData = (data: string): string => {
    // Generate a random IV
    const iv = randomBytes(IV_LENGTH);

    // Create cipher
    const cipher = createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);

    // Encrypt the data
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Get the auth tag
    const authTag = cipher.getAuthTag();

    // Combine IV, encrypted data, and auth tag
    const combined = Buffer.concat([
        iv,
        Buffer.from(encrypted, 'hex'),
        authTag
    ]);

    return combined.toString('base64');
};

export const decryptData = (encrypted: string): string => {
    // Convert base64 to buffer
    const combined = Buffer.from(encrypted, 'base64');

    // Extract IV, encrypted data, and auth tag
    const iv = combined.slice(0, IV_LENGTH);
    const authTag = combined.slice(-16);
    const encryptedData = combined.slice(IV_LENGTH, -16);

    // Create decipher
    const decipher = createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
    decipher.setAuthTag(authTag);

    // Decrypt the data
    let decrypted = decipher.update(encryptedData);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString('utf8');
};

export const generateJWT = async (payload: { publicKey: string }) => {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(JWT_SECRET);
};

export const verifyJWT = async (token: string) => {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload;
    } catch (error) {
        return null;
    }
}; 