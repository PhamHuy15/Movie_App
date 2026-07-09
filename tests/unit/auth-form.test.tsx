import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AuthForm } from '@/components/auth/auth-form';

describe('AuthForm', () => {
    it('validate email và mật khẩu bằng Zod', () => {
        render(<AuthForm />);
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'sai-email' } });
        fireEvent.change(screen.getByPlaceholderText('Mật khẩu'), { target: { value: '123' } });
        fireEvent.submit(screen.getByRole('button', { name: 'Đăng nhập' }).closest('form')!);
        expect(screen.getByRole('alert')).toHaveTextContent(/Email không hợp lệ|Mật khẩu/);
    });
});
