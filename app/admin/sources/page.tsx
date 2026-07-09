import { SourceAdminForm } from '@/components/admin/source-admin-form';

export default function Page() {
    return (
        <div className="mx-auto max-w-4xl px-5 pt-24 pb-20">
            <p className="text-brand text-sm font-semibold">Cineva Admin</p>
            <h1 className="font-display mt-2 text-4xl font-bold">Quản lý nguồn phim</h1>
            <p className="mt-3 text-white/55">
                Nguồn phát chính được lấy trực tiếp từ NguonC. Form này chỉ dùng khi cần bổ sung nguồn HLS/MP4 hợp lệ
                theo slug phim NguonC.
            </p>
            <SourceAdminForm />
        </div>
    );
}
