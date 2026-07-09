import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SearchBox } from '@/components/search/search-box';

const push = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));

describe('SearchBox', () => {
    it('debounce 300ms rồi hiển thị kết quả', async () => {
        vi.useFakeTimers();
        vi.stubGlobal(
            'fetch',
            vi
                .fn()
                .mockResolvedValue({
                    json: async () => ({ data: [{ id: 1, slug: 'phim-1', title: 'Dấu Vết', year: 2026 }] }),
                }),
        );
        render(<SearchBox />);
        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Dấu' } });
        expect(screen.queryByText('Dấu Vết')).not.toBeInTheDocument();
        await act(async () => {
            await vi.advanceTimersByTimeAsync(300);
            await Promise.resolve();
            await Promise.resolve();
        });
        expect(screen.getByText('Dấu Vết')).toBeInTheDocument();
        vi.useRealTimers();
    });
});
