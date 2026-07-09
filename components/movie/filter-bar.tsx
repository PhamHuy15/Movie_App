'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useSyncExternalStore } from 'react';

const filters = [
    {
        key: 'genre',
        label: 'Thể loại',
        options: [
            ['', 'Tất cả'],
            ['hanh-dong', 'Hành động'],
            ['tam-ly', 'Tâm lý'],
            ['tinh-cam', 'Tình cảm'],
            ['kinh-di', 'Kinh dị'],
        ],
    },
    {
        key: 'country',
        label: 'Quốc gia',
        options: [
            ['', 'Tất cả'],
            ['han-quoc', 'Hàn Quốc'],
            ['trung-quoc', 'Trung Quốc'],
            ['nhat-ban', 'Nhật Bản'],
            ['thai-lan', 'Thái Lan'],
            ['au-my', 'Âu Mỹ'],
            ['viet-nam', 'Việt Nam'],
        ],
    },
] as const;

export function FilterBar() {
    const router = useRouter();
    const pathname = usePathname();
    const current = useSearchParams();
    const hydrated = useSyncExternalStore(
        () => () => undefined,
        () => true,
        () => false,
    );

    const update = (key: string, value: string) => {
        const params = new URLSearchParams(current);
        params.delete('page');

        if (value) {
            params.set(key, value);
            for (const filter of filters) {
                if (filter.key !== key) params.delete(filter.key);
            }
        } else {
            params.delete(key);
        }

        router.replace(`${pathname}${params.size ? `?${params}` : ''}`);
    };

    return (
        <div aria-label="Bộ lọc phim" className="flex flex-wrap gap-3">
            {filters.map((filter) => (
                <label key={filter.key} className="text-xs font-medium text-white/60">
                    {filter.label}
                    <select
                        aria-label={filter.label}
                        disabled={!hydrated}
                        value={current.get(filter.key) ?? ''}
                        onChange={(event) => update(filter.key, event.target.value)}
                        className="focus:border-brand ml-2 rounded-full border border-white/10 bg-[#151719] px-4 py-2 text-white outline-none disabled:opacity-60"
                    >
                        {filter.options.map(([value, label]) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                </label>
            ))}
        </div>
    );
}
