'use client';

import Link from 'next/link';
import { useState } from 'react';
import { z } from 'zod';

const schema = z.object({ email: z.email('Email không hợp lệ'), password: z.string().min(8, 'Mật khẩu cần ít nhất 8 ký tự') });

export function AuthForm({ register = false }: { register?: boolean }) {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    return (
        <form
            onSubmit={async (event) => {
                event.preventDefault();
                const form = new FormData(event.currentTarget);
                const parsed = schema.safeParse({ email: form.get('email'), password: form.get('password') });
                if (!parsed.success) return setError(parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ');
                setLoading(true);
                setError('');
                const response = await fetch(register ? '/api/auth/register' : '/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(Object.fromEntries(form.entries())),
                });
                const payload = await response.json();
                setLoading(false);
                if (!response.ok) return setError(payload.error ?? 'Không thể xác thực');
                window.location.href = '/';
            }}
            className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[.04] p-7 backdrop-blur-xl"
        >
            <h1 className="text-3xl font-black">{register ? 'Tạo tài khoản' : 'Chào mừng trở lại'}</h1>
            <p className="mt-2 text-sm text-white/45">{register ? 'Lưu phim yêu thích trên mọi thiết bị.' : 'Tiếp tục hành trình điện ảnh của bạn.'}</p>
            {register && <input name="name" placeholder="Tên hiển thị" className="mt-7 w-full rounded-xl border border-white/10 bg-black/30 p-3" />}
            <input name="email" type="email" placeholder="Email" className="mt-4 w-full rounded-xl border border-white/10 bg-black/30 p-3" />
            <input name="password" type="password" placeholder="Mật khẩu" className="mt-4 w-full rounded-xl border border-white/10 bg-black/30 p-3" />
            {error && <p role="alert" className="mt-3 text-sm text-amber-400">{error}</p>}
            <button disabled={loading} className="bg-brand mt-6 h-12 w-full rounded-xl font-bold text-black disabled:opacity-50">
                {loading ? 'Đang xử lý…' : register ? 'Đăng ký' : 'Đăng nhập'}
            </button>
            <p className="mt-5 text-center text-sm text-white/45">
                {register ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}{' '}
                <Link className="text-brand" href={register ? '/login' : '/register'}>{register ? 'Đăng nhập' : 'Đăng ký'}</Link>
            </p>
        </form>
    );
}
