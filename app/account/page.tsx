import Link from 'next/link';
export default function Page() {
    return (
        <div className="mx-auto max-w-3xl px-5 pt-28 pb-16">
            <h1 className="text-4xl font-black">Tài khoản</h1>
            <div className="mt-8 rounded-2xl bg-white/5 p-6">
                <div className="bg-brand grid size-16 place-items-center rounded-full text-2xl font-black text-black">
                    C
                </div>
                <h2 className="mt-4 text-xl font-bold">Khách Cineva</h2>
                <p className="mt-1 text-white/45">Lịch sử hiện được lưu an toàn trên thiết bị này.</p>
                <Link
                    href="/dang-nhap"
                    className="bg-brand mt-6 inline-flex rounded-full px-5 py-3 font-bold text-black"
                >
                    Đăng nhập để đồng bộ
                </Link>
            </div>
        </div>
    );
}
