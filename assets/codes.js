/* ============================================================
         DỮ LIỆU MÃ — bản demo: mã mẫu để xem giao diện.
         Khi có mã thật: chỉ cần sửa mảng DEALS bên dưới
         (code, điều kiện, hạn dùng, link affiliate) là trang chạy.
         ============================================================ */
      var PLATFORMS = {
        shopee: { name: "Shopee", url: "https://shopee.vn" },
        lazada: { name: "Lazada", url: "https://www.lazada.vn" },
        tiktok: { name: "TikTok Shop", url: "https://www.tiktok.com" }
      };
      var CATEGORIES = [
        { key: "all", label: "Tất cả nhu cầu" },
        { key: "freeship", label: "Freeship" },
        { key: "toan-san", label: "Toàn sàn" },
        { key: "thoi-trang", label: "Thời trang" },
        { key: "dien-tu", label: "Điện tử" },
        { key: "me-be", label: "Mẹ & bé" },
        { key: "lam-dep", label: "Làm đẹp" }
      ];
      var DEALS = [
        { platform:"shopee", code:"MAU-FS0D", title:"Freeship tối đa 25K cho shop Freeship Xtra", discount:"0đ ship", discLabel:"tối đa 25K", value:25, cond:"Đơn từ 0đ · Chỉ áp cho shop có gắn nhãn Freeship Xtra, hỗ trợ phí ship tối đa 25K", min:0, cat:"freeship", expires:"2026-10-31", hot:true },
        { platform:"shopee", code:"MAU-SP5011", title:"Giảm 50K toàn sàn — đợt sale 11.11", discount:"−50K", discLabel:"đơn từ 250K", value:50, cond:"Đơn từ 250K · Không áp cho một số ngành hàng giới hạn", min:250, cat:"toan-san", expires:"2026-11-11", hot:true },
        { platform:"lazada", code:"MAU-LZFS30", title:"Voucher freeship giảm 30K", discount:"−30K ship", discLabel:"đơn từ 99K", value:30, cond:"Đơn từ 99K · Thu thập thêm tại trang Freeship của Lazada", min:99, cat:"freeship", expires:"2026-11-11", hot:true },
        { platform:"tiktok", code:"MAU-TTNEW40", title:"Ưu đãi khách mới TikTok Shop giảm 40K", discount:"−40K", discLabel:"đơn từ 120K", value:40, cond:"Chỉ tài khoản chưa từng mua trên TikTok Shop · Đơn từ 120K", min:120, cat:"toan-san", expires:"2026-11-30", hot:true },
        { platform:"shopee", code:"MAU-SPFS30", title:"Thời trang giảm 30% — tối đa 60K", discount:"−30%", discLabel:"tối đa 60K", value:60, cond:"Đơn từ 150K · Áp cho ngành hàng thời trang", min:150, cat:"thoi-trang", expires:"2026-10-28", hot:false },
        { platform:"lazada", code:"MAU-LZTC100", title:"Điện tử giảm 100K cho đơn lớn", discount:"−100K", discLabel:"đơn từ 1 triệu", value:100, cond:"Đơn từ 1.000K · Áp cho điện thoại, laptop, phụ kiện chính hãng", min:1000, cat:"dien-tu", expires:"2026-10-24", hot:false },
        { platform:"tiktok", code:"MAU-TTFS20", title:"Freeship TikTok Shop giảm 20K", discount:"−20K ship", discLabel:"đơn từ 79K", value:20, cond:"Đơn từ 79K · Số lượng voucher mỗi ngày có hạn", min:79, cat:"freeship", expires:"2026-10-25", hot:false },
        { platform:"shopee", code:"MAU-SPMOM20", title:"Mẹ & bé giảm 20% — tối đa 100K", discount:"−20%", discLabel:"tối đa 100K", value:100, cond:"Đơn từ 300K · Áp cho tã, sữa, đồ dùng cho bé", min:300, cat:"me-be", expires:"2026-11-30", hot:false },
        { platform:"lazada", code:"MAU-LZ15ALL", title:"Giảm 15% toàn sàn — tối đa 45K", discount:"−15%", discLabel:"tối đa 45K", value:45, cond:"Đơn từ 199K · Không áp cùng voucher đối tác thanh toán", min:199, cat:"toan-san", expires:"2026-11-30", hot:false },
        { platform:"tiktok", code:"MAU-TTLV25", title:"Mua trong livestream giảm thêm 25%", discount:"−25%", discLabel:"tối đa 50K", value:50, cond:"Chỉ áp khi đặt hàng ngay trong phiên live · Đơn từ 99K", min:99, cat:"toan-san", expires:"2026-11-11", hot:false },
        { platform:"lazada", code:"MAU-LZBT35", title:"Làm đẹp giảm 35K cuối tháng", discount:"−35K", discLabel:"đơn từ 179K", value:35, cond:"Đơn từ 179K · Áp cho mỹ phẩm và chăm sóc cá nhân", min:179, cat:"lam-dep", expires:"2026-11-11", hot:false },
        { platform:"shopee", code:"MAU-SP1212", title:"Chốt năm 12.12 — giảm 60K toàn sàn", discount:"−60K", discLabel:"đơn từ 399K", value:60, cond:"Đơn từ 399K · Mở áp dụng từ đợt sale 12.12", min:399, cat:"toan-san", expires:"2026-12-12", hot:false },
        { platform:"shopee", code:"MAU-SPDT80", title:"Điện tử giảm 80K cho tai nghe & phụ kiện", discount:"−80K", discLabel:"đơn từ 500K", value:80, cond:"Đơn từ 500K · Áp cho tai nghe, loa, sạc và phụ kiện điện thoại", min:500, cat:"dien-tu", expires:"2026-11-11", hot:false },
        { platform:"lazada", code:"MAU-LZMM55", title:"Mẹ & bé giảm 55K ngày hội thương hiệu", discount:"−55K", discLabel:"đơn từ 349K", value:55, cond:"Đơn từ 349K · Áp cho gian hàng mẹ & bé chính hãng", min:349, cat:"me-be", expires:"2026-11-30", hot:false },
        { platform:"tiktok", code:"MAU-TTBT30", title:"Làm đẹp giảm 30K cho đơn skincare", discount:"−30K", discLabel:"đơn từ 149K", value:30, cond:"Đơn từ 149K · Áp cho skincare và chăm sóc cá nhân trong TikTok Shop", min:149, cat:"lam-dep", expires:"2026-10-26", hot:true },
        { platform:"lazada", code:"MAU-LZFA45", title:"Thời trang giảm 45K cuối tháng lương về", discount:"−45K", discLabel:"đơn từ 259K", value:45, cond:"Đơn từ 259K · Áp cho thời trang nam, nữ và phụ kiện", min:259, cat:"thoi-trang", expires:"2026-10-23", hot:false },
        { platform:"tiktok", code:"MAU-TTDT70", title:"Điện tử giảm 70K trong khung giờ vàng", discount:"−70K", discLabel:"đơn từ 599K", value:70, cond:"Đơn từ 599K · Chỉ mở trong khung giờ flash sale của TikTok Shop", min:599, cat:"dien-tu", expires:"2026-11-11", hot:false },
        { platform:"shopee", code:"MAU-SPBT25", title:"Làm đẹp giảm 25% — tối đa 70K", discount:"−25%", discLabel:"tối đa 70K", value:70, cond:"Đơn từ 200K · Áp cho mỹ phẩm và chăm sóc da", min:200, cat:"lam-dep", expires:"2026-11-30", hot:false },
        { platform:"lazada", code:"MAU-LZ1020", title:"Sale 10.10 giảm 20K toàn sàn (đã kết thúc)", discount:"−20K", discLabel:"đơn từ 150K", value:20, cond:"Đơn từ 150K · Mã của đợt sale 10.10, đã hết hạn — giữ lại để bạn thấy cách trang xử lý mã chết", min:150, cat:"toan-san", expires:"2026-10-20", hot:false }
      ];
