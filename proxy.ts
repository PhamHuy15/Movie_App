import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;
    if (!username || !password) return new NextResponse('Trang quản trị chưa được cấu hình.', { status: 503 });
    const authorization = request.headers.get('authorization');
    if (authorization?.startsWith('Basic ')) {
        const [providedUser, providedPassword] = atob(authorization.slice(6)).split(':');
        if (providedUser === username && providedPassword === password) return NextResponse.next();
    }
    return new NextResponse('Cần xác thực quản trị viên.', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="Cineva Admin", charset="UTF-8"' },
    });
}
export const config = { matcher: ['/admin/:path*', '/api/admin/:path*'] };
