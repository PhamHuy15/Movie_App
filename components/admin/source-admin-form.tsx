'use client';

import { useState } from 'react';

const fields = [
    ['nguoncSlug', 'Slug phim NguonC'],
    ['provider', 'Provider'],
    ['serverName', 'Tên server'],
    ['url', 'URL HLS/MP4'],
    ['season', 'Mùa (nếu có)'],
    ['episode', 'Tập (nếu có)'],
    ['subtitleUrl', 'Subtitle WebVTT (nếu có)'],
] as const;

export function SourceAdminForm() {
    const [message, setMessage] = useState('');

    return (
        <form
            className="mt-8 grid gap-4 rounded-2xl border border-white/10 bg-white/[.03] p-6 md:grid-cols-2"
            onSubmit={async (event) => {
                event.preventDefault();
                setMessage('Đang kiểm tra...');

                const body = Object.fromEntries(new FormData(event.currentTarget));
                const response = await fetch('/api/admin/sources', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                });
                const result = await response.json();
                setMessage(response.ok ? 'Đã lưu nguồn phát.' : (result.error ?? 'Không thể lưu nguồn.'));
            }}
        >
            {fields.map(([name, label]) => (
                <label key={name} className="text-sm font-medium">
                    {label}
                    <input
                        name={name}
                        required={['nguoncSlug', 'provider', 'serverName', 'url'].includes(name)}
                        className="focus:border-brand mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 font-normal outline-none"
                    />
                </label>
            ))}
            <label className="text-sm font-medium">
                Loại
                <select name="type" className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3">
                    <option value="hls">HLS</option>
                    <option value="mp4">MP4</option>
                </select>
            </label>
            <label className="flex items-center gap-2 self-end py-3 text-sm">
                <input type="checkbox" name="enabled" defaultChecked /> Bật nguồn phát
            </label>
            <button className="bg-brand h-12 rounded-xl font-semibold text-black md:col-span-2">
                Kiểm tra và lưu nguồn
            </button>
            {message && (
                <p role="status" className="text-sm text-amber-300 md:col-span-2">
                    {message}
                </p>
            )}
        </form>
    );
}
