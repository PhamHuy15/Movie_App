import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Loading from '@/app/loading';
import ErrorPage from '@/app/error';

describe('UI states', () => {
    it('render loading skeleton', () => {
        const { container } = render(<Loading />);
        expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(1);
    });
    it('nút thử lại gọi reset', () => {
        const reset = vi.fn();
        render(<ErrorPage reset={reset} />);
        fireEvent.click(screen.getByRole('button', { name: 'Thử lại' }));
        expect(reset).toHaveBeenCalledOnce();
    });
});
