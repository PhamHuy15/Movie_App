import Link from 'next/link';
export function AppFooter() {
    return (
        <footer className="border-t border-white/5 px-5 py-14 text-sm text-white/55 lg:px-10">
            <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
                <div>
                    <div className="mb-3 text-2xl font-black text-white">
                        <span className="text-brand">C</span>INEVA
                    </div>
                    <p>Không gian điện ảnh hiện đại, nội dung từ các nguồn được cấp quyền.</p>
                </div>
                <div className="flex flex-wrap gap-5">
                    <Link href="/movies">Khám phá</Link>
                    <Link href="/privacy-policy">Chính sách</Link>
                    <Link href="/terms">Điều khoản</Link>
                    <Link href="/lien-he">Liên hệ</Link>
                </div>
                <p>© {new Date().getFullYear()} Cineva. Cineva không lưu trữ nội dung video vi phạm bản quyền.</p>
            </div>
        </footer>
    );
}
