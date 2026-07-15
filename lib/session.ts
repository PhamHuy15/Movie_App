import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const secret = process.env.AUTH_SECRET ?? 'cineva-development-secret-change-me';
export function hashPassword(password: string) {
    const salt = randomBytes(16).toString('hex');
    return `${salt}:${scryptSync(password, salt, 64).toString('hex')}`;
}
export function verifyPassword(password: string, stored: string) {
    const [salt, expected] = stored.split(':');
    if (!salt || !expected) return false;
    const actual = scryptSync(password, salt, 64);
    return expected.length === actual.toString('hex').length && timingSafeEqual(actual, Buffer.from(expected, 'hex'));
}
export function createSession(userId: string) {
    const payload = Buffer.from(JSON.stringify({ userId, exp: Date.now() + 1000 * 60 * 60 * 24 * 30 })).toString('base64url');
    return `${payload}.${createHmac('sha256', secret).update(payload).digest('base64url')}`;
}
export function readSession(value?: string | null) {
    if (!value) return null;
    const [payload, signature] = value.split('.');
    if (!payload || !signature) return null;
    const expected = createHmac('sha256', secret).update(payload).digest('base64url');
    if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
    try {
        const data = JSON.parse(Buffer.from(payload, 'base64url').toString()) as { userId: string; exp: number };
        return data.exp > Date.now() ? data : null;
    } catch { return null; }
}
export function userIdFromRequest(request: Request) {
    return readSession(request.headers.get('cookie')?.match(/cineva_session=([^;]+)/)?.[1])?.userId ?? null;
}
