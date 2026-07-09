import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="grid min-h-screen place-items-center px-5 text-center">
            <div>
                <p className="text-brand text-8xl font-black">404</p>
                <h1 className="mt-3 text-3xl font-bold">Cảnh phim này không tồn tại</h1>
                <p className="mt-3 text-white/55">Có vẻ bạn đã đi lạc khỏi rạp chiếu.</p>
                <Link href="/" className="bg-brand mt-7 inline-flex rounded-full px-6 py-3 font-bold text-black">
                    Về trang chủ
                </Link>
            </div>
        </div>
    );
}
