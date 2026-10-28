# Bàn giao cho IT — Dự án Mã Giảm Giá

Repo: https://github.com/duyphuc1413/ma-giam-gia
Trang live tạm: https://duyphuc1413.github.io/ma-giam-gia/
Nhánh deploy: `main`, thư mục gốc `/`, GitHub Pages (Deploy from a branch).

## 1. Đây là cái gì, và không phải cái gì

- Đây là trang tĩnh (static site), không có server, database, API key,
  tài khoản đăng nhập hay hệ thống thanh toán riêng.
- Mọi giao dịch, thanh toán và đổi trả đều diễn ra trên app/website
  chính thức của Shopee, Lazada, TikTok Shop. Trang này chỉ giúp tìm
  và copy mã nhanh hơn.
- Không có secret nào trong repo. Tuyệt đối không commit mật khẩu,
  token affiliate hay thông tin thanh toán vào repo.

## 2. Cấu trúc file

- `index.html` — cấu trúc và nội dung tĩnh. Ảnh hero hiện vẫn nhúng
  data URI trong file này (xem mục 6).
- `assets/styles.css` — toàn bộ CSS.
- `assets/codes.js` — dữ liệu mã. Đây là file IT sẽ sửa nhiều nhất.
- `assets/app.js` — logic hiển thị, lọc, tìm kiếm, sắp xếp, copy,
  đếm ngược sale, máy tính tiết kiệm, form đăng ký sớm.
- `README.md`, `BAN-GIAO-IT.md` — tài liệu này.

## 3. Cách cập nhật mã giảm giá (việc thường xuyên nhất)

Mở `assets/codes.js`, sửa mảng `DEALS`. Mỗi mã là 1 object, ví dụ:

```js
{
  platform: "shopee",          // shopee | lazada | tiktok
  code: "MAU-SP5011",
  title: "Giảm 50K toàn sàn — đợt sale 11.11",
  discount: "−50K",
  discLabel: "đơn từ 250K",
  value: 50,                    // số dùng để sắp xếp / tính tiết kiệm
  cond: "Đơn từ 250K · ...",
  min: 250,                     // đơn tối thiểu (nghìn đồng, theo quy ước trong file)
  cat: "toan-san",              // all | freeship | toan-san | thoi-trang | dien-tu | me-be | lam-dep
  expires: "2026-11-11",        // YYYY-MM-DD, giờ Việt Nam
  hot: true                     // true = vào khu mã hot (nếu còn hạn)
}
```

Quy tắc hết hạn trong `assets/app.js`: mã có ngày hết hạn là hôm nay
hoặc sớm hơn được coi là đã hết hạn — làm mờ, khóa copy, đẩy xuống
cuối, loại khỏi khu hot và máy tính tiết kiệm. Vì vậy chỉ cần sửa
`expires` là đủ, không cần tự xóa mã hết hạn khỏi file (nhưng nên
dọn định kỳ để file không phình to).

## 4. Cách gắn link affiliate thật

Hiện tại nút "Dùng ngay" dùng URL trong `PLATFORMS` ở đầu
`assets/codes.js`:

```js
var PLATFORMS = {
  shopee: { name: "Shopee", url: "https://shopee.vn" },
  lazada: { name: "Lazada", url: "https://www.lazada.vn" },
  tiktok: { name: "TikTok Shop", url: "https://www.tiktok.com" }
};
```

Thay từng `url` bằng link affiliate tương ứng là xong, không cần
sửa `assets/app.js`. Hiện tại mỗi mã chưa có trường link riêng —
nếu sau này cần link riêng theo chiến dịch, thêm trường `link`
vào từng object trong `DEALS` và sửa `assets/app.js` ở chỗ tạo
nút "Dùng ngay" để ưu tiên `link` trước `PLATFORMS[platform].url`.

Tài khoản affiliate Shopee, Lazada, TikTok Shop là tài khoản riêng,
không nằm trong repo. Chủ dự án phải bàn giao riêng qua kênh bảo mật
nếu IT là người thay link.

## 5. Cách deploy và kiểm tra

1. Sửa file, commit và đẩy lên nhánh `main`.
2. GitHub Pages tự build lại trong vài phút. Không có bước build
   hay lệnh npm nào.
3. Kiểm tra link live, tải lại trang một lần nếu vẫn thấy bản cũ
   (cache). Kiểm tra: mã mới hiện đúng, mã hết hạn bị làm mờ và
   khóa copy, lọc theo sàn và nhu cầu vẫn chạy, nút Copy đổi
   thành đã copy.
4. Không đẩy thẳng lên `main` nếu chủ dự án yêu cầu duyệt qua
   pull request — làm nhánh riêng, mở PR, duyệt rồi mới merge.

## 6. Những điểm IT cần biết trước (không giấu)

- Ảnh hero: vẫn nhúng data URI trong `index.html` vì công cụ đẩy
  file của Muse chỉ đẩy được file text, không đẩy được file nhị
  phân. IT dùng git trực tiếp có thể giải mã data URI đó ra
  `assets/hero.webp` và đổi `src` thành `assets/hero.webp`.
- Nhãn phiên bản: banner và chân trang đã sửa thành "Bản demo V3"
  trong bản tách file này. Phần lộ trình trong trang vẫn nhắc tới
  V1/V2 như các giai đoạn cũ — đó là lịch sử, không phải lỗi.
- Form đăng ký sớm: chỉ mở ứng dụng email của người dùng bằng
  mailto (chưa có địa chỉ người nhận) hoặc sao chép thông tin,
  không lưu lên máy chủ, không có backend. Đừng quảng cáo nó như
  hệ thống đăng ký thật cho tới khi chốt địa chỉ nhận hoặc làm
  backend.
- Chia sẻ trang: trang dùng Web Share API của thiết bị, không
  tự lấy địa chỉ trang bằng script. Trên GitHub Pages, người dùng
  chia sẻ bằng nút chia sẻ của trình duyệt là đủ.
- Hoàn tiền (cashback): mới ở mức "sắp ra mắt" trên trang, chưa
  có hệ thống tài khoản, theo dõi đơn theo người dùng hay đối
  soát đơn. Muốn làm thật phải nâng cấp lên ứng dụng có tài
  khoản và số dư, không làm được chỉ bằng trang tĩnh này.
- Bảo mật đã có: HTTPS qua GitHub Pages, không đăng nhập, không
  thu thập mật khẩu/thông tin thanh toán, không lưu localStorage
  hay cookie cho mã yêu thích (chỉ sống trong phiên xem), link
  ra sàn dùng `rel="noopener sponsored"`, không có script của
  bên thứ ba ngoài Google Fonts.

## 7. Chuyển quyền cho IT sau này

- Giữ chủ sở hữu, thêm IT làm collaborator quyền Write: link
  github.io không đổi.
- Chuyển hẳn quyền sở hữu repo: link github.io sẽ đổi sang tên
  tài khoản mới, phải cập nhật hết link quảng cáo — trừ khi đã
  gắn domain riêng trước khi chuyển.
- IT fork repo rồi gửi pull request: an toàn nhất nếu chủ dự án
  muốn giữ quyền duyệt.
