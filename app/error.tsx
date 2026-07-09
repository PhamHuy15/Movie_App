'use client';
import { RotateCcw } from 'lucide-react';
export default function ErrorPage({ reset }: { reset: () => void }) {
    return (
        <div className="grid min-h-screen place-items-center text-center">
            <div>
                <h1 className="text-2xl font-bold">Có lỗi xảy ra</h1>
                <p className="mt-2 text-white/45">Cineva chưa thể tải nội dung này.</p>
                <button
                    onClick={reset}
                    className="bg-brand mt-5 inline-flex items-center gap-2 rounded-full px-5 py-3 font-bold text-black"
                >
                    <RotateCcw size={17} />
                    Thử lại
                </button>
            </div>
        </div>
    );
}
