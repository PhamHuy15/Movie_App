# Cineva

Movie app xây dựng bằng Next.js App Router, TypeScript và Tailwind CSS. Catalog, chi tiết phim, tìm kiếm, danh mục và nguồn phát hiện dùng trực tiếp NguonC API.

## Cài đặt

Yêu cầu Node.js 20.9 trở lên.

```bash
npm install
copy .env.example .env.local
npm run dev
```

Mở `http://localhost:3000`.

## NguonC API

Mặc định app gọi `https://phim.nguonc.com/api`. Có thể override bằng:

```env
NGUONC_API_BASE_URL=https://phim.nguonc.com/api
```

Các luồng chính:

- `GET /api/films/phim-moi-cap-nhat?page=1`
- `GET /api/films/danh-sach/phim-bo?page=1`
- `GET /api/films/danh-sach/phim-le?page=1`
- `GET /api/films/danh-sach/hoat-hinh?page=1`
- `GET /api/films/danh-sach/tv-shows?page=1`
- `GET /api/films/search?keyword=...&page=1`
- `GET /api/films/the-loai/{slug}?page=1`
- `GET /api/films/quoc-gia/{slug}?page=1`
- `GET /api/film/{slug}`

Không cần API key bên thứ ba để chạy dự án.

## Nguồn phát

`services/stream-provider.ts` là adapter duy nhất UI phụ thuộc. Adapter hiện tại đọc danh sách tập và link phát từ NguonC detail response, ưu tiên HLS/MP4 rồi fallback embed nếu API trả về.

Endpoint nội bộ:

- `GET /api/stream/[movieId]`
- `GET /api/stream/[movieId]/[season]/[episode]`

Trang `/admin/sources` vẫn có thể dùng để bổ sung nguồn HLS/MP4 theo slug NguonC nếu đã cấu hình PostgreSQL.

## Database và đăng nhập

Prisma schema có `User`, `Favorite`, `WatchHistory` và bảng nguồn phát bổ sung theo `nguoncSlug`. Điền PostgreSQL `DATABASE_URL`, chạy:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

## Kiểm tra

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```
