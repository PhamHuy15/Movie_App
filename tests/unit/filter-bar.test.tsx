import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FilterBar } from '@/components/movie/filter-bar';

const replace = vi.fn();

vi.mock('next/navigation', () => ({
    useRouter: () => ({ replace }),
    usePathname: () => '/discover',
    useSearchParams: () => new URLSearchParams(),
}));

describe('FilterBar', () => {
    it('cập nhật query theo slug NguonC cho thể loại và quốc gia', () => {
        render(<FilterBar />);

        fireEvent.change(screen.getByLabelText('Thể loại'), { target: { value: 'tam-ly' } });
        expect(replace).toHaveBeenCalledWith('/discover?genre=tam-ly');

        fireEvent.change(screen.getByLabelText('Quốc gia'), { target: { value: 'han-quoc' } });
        expect(replace).toHaveBeenCalledWith('/discover?country=han-quoc');
    });
});
