# Mã Giảm Giá — Shopee · Lazada · TikTok Shop

Landing page tổng hợp mã giảm giá cho dự án affiliate độc lập (tách khỏi upagency.vn).
Trang live tạm: https://duyphuc1413.github.io/ma-giam-gia/

## Cấu trúc chuyên nghiệp (sau khi tách file)

```
index.html            # Cấu trúc trang, meta, nội dung tĩnh
assets/
  styles.css          # Toàn bộ CSS (trước đây nằm trong <style> của index.html)
  codes.js            # Dữ liệu: PLATFORMS, CATEGORIES, DEALS (mã giảm giá)
  app.js              # Logic: lọc, tìm kiếm, sắp xếp, copy, đếm ngược, máy tính tiết kiệm
  hero.webp           # (Dự kiến) Ảnh hero — xem lưu ý bên dưới
README.md
BAN-GIAO-IT.md        # Hướng dẫn bàn giao cho IT
```

Lưu ý về ảnh hero: trong bản hiện tại, ảnh hero vẫn đang nhúng dạng data URI
trong `index.html` (1 dòng rất dài), vì công cụ đẩy file lên GitHub của Muse
chỉ đẩy được file text UTF-8, không đẩy được file nhị phân. IT dùng git trực
tiếp có thể tách ảnh này ra `assets/hero.webp` và đổi `src` của thẻ `<img>`
thành `assets/hero.webp` mà không đổi gì khác.

## Chạy thử ở máy local

Không mở bằng `file://` trực tiếp nếu trình duyệt chặn script ngoài. Dùng:

```bash
python3 -m http.server 8000
# mở http://127.0.0.1:8000/
```

## Trạng thái hiện tại

- Toàn bộ mã trên trang hiện là **mã mẫu, tiền tố MAU-**, chưa phải mã thật.
- Nút "Dùng ngay" hiện trỏ về trang chủ chính thức của từng sàn, chưa phải
  link affiliate. Muốn gắn link affiliate, sửa `url` trong `PLATFORMS`
  ở `assets/codes.js` (xem `BAN-GIAO-IT.md`).
- Form đăng ký sớm trong trang chỉ mở ứng dụng email của người dùng
  (mailto, chưa có địa chỉ người nhận) hoặc sao chép thông tin, không lưu
  đăng ký lên máy chủ. Chưa quảng cáo form này như một hệ thống đăng ký
  thật cho tới khi chốt địa chỉ nhận và/hoặc backend đăng ký.

## Deploy

- GitHub Pages: bật Pages cho repo này, nguồn Deploy from a branch,
  nhánh `main`, thư mục `/ (root)`.
- Không có bước build, không cần npm. Đẩy lên `main` là Pages tự build
  lại trong vài phút. Nếu mở link live mà vẫn thấy bản cũ, tải lại trang
  một lần (cache của Pages/trình duyệt).
- Chưa gắn domain riêng: chưa có file `CNAME` cho tới khi chốt domain.
