var state = { platform: "all", cat: "all", query: "", sort: "hot", hotOnly: false, urgentOnly: false, favOnly: false };
      var favorites = {}; /* Lưu mã chỉ trong phiên xem hiện tại, không lưu trữ lâu dài */
      var grid = document.getElementById("grid");
      var hotGrid = document.getElementById("hotGrid");
      var hotEmpty = document.getElementById("hotEmpty");
      var emptyState = document.getElementById("emptyState");
      var resultLine = document.getElementById("resultLine");
      var toast = document.getElementById("toast");
      var toastTimer = null;

      function daysLeft(expires) {
        /* Số ngày còn lại tính theo ngày dương lịch giờ Việt Nam (UTC+7):
           mã có ngày hết hạn là hôm nay hoặc sớm hơn được coi là đã hết hạn. */
        var p = expires.split("-");
        var end = Date.UTC(+p[0], +p[1] - 1, +p[2]);
        var nowICT = new Date(Date.now() + 7 * 3600000);
        var today = Date.UTC(nowICT.getUTCFullYear(), nowICT.getUTCMonth(), nowICT.getUTCDate());
        return Math.round((end - today) / 86400000);
      }
      function isExpired(d) { return daysLeft(d.expires) <= 0; }
      function fmtDate(expires) {
        var p = expires.split("-");
        return p[2] + "/" + p[1] + "/" + p[0];
      }
      function catLabel(key) {
        for (var i = 0; i < CATEGORIES.length; i++) if (CATEGORIES[i].key === key) return CATEGORIES[i].label;
        return key;
      }
      function showToast(msg) {
        toast.textContent = msg;
        toast.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { toast.classList.remove("show"); }, 2400);
      }
      function copyCode(code, btn) {
        function done() {
          showToast("Đã copy mã " + code + " — dán vào ô voucher khi thanh toán nhé!");
          if (btn) {
            var old = btn.textContent;
            btn.textContent = "Đã copy ✓";
            btn.classList.add("copied");
            setTimeout(function () { btn.textContent = old; btn.classList.remove("copied"); }, 2000);
          }
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(code).then(done, function () { fallback(); });
        } else { fallback(); }
        function fallback() {
          var ta = document.createElement("textarea");
          ta.value = code;
          ta.style.position = "fixed"; ta.style.opacity = "0";
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand("copy"); done(); }
          catch (e) { showToast("Không copy tự động được — mã của bạn là: " + code); }
          document.body.removeChild(ta);
        }
      }
      function dealCard(d) {
        var pf = PLATFORMS[d.platform];
        var dl = daysLeft(d.expires);
        var expired = isExpired(d);
        var urgent = !expired && dl <= 3;
        var expText = expired ? ("Đã hết hạn " + fmtDate(d.expires) + " — mã chỉ còn để tham khảo")
                    : dl > 1 ? ("Hết hạn " + fmtDate(d.expires) + " · còn " + dl + " ngày")
                    : dl === 1 ? ("Hết hạn " + fmtDate(d.expires) + " · còn 1 ngày")
                    : ("Hết hạn hôm nay — " + fmtDate(d.expires));
        var card = document.createElement("article");
        card.className = "deal pf-" + d.platform + (expired ? " expired" : "");
        card.innerHTML =
          '<div class="deal-top">' +
            '<div class="deal-disc"><span class="big"></span><span class="small"></span></div>' +
            '<div class="deal-info">' +
              '<div class="deal-tags">' +
                '<span class="tag pf"></span>' +
                '<span class="tag"></span>' +
                (d.hot && !expired ? '<span class="tag hot">HOT</span>' : '') +
                (urgent ? '<span class="tag urgent">Sắp hết hạn</span>' : '') +
                (expired ? '<span class="tag gone">Đã hết hạn</span>' : '') +
              '</div>' +
              '<h3></h3>' +
              '<p class="cond"></p>' +
              '<p class="exp"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg><span></span></p>' +
            '</div>' +
          '</div>' +
          '<div class="deal-foot">' +
            '<div class="code-box"><code></code><button type="button" class="btn-copy">Copy</button></div>' +
            '<a class="btn-go" target="_blank" rel="noopener sponsored">Dùng ngay</a>' +
          '</div>' +
          '<div class="deal-actions">' +
            '<button type="button" class="btn-detail">Xem chi tiết</button>' +
            '<button type="button" class="btn-fav" aria-pressed="false">☆ Lưu mã</button>' +
          '</div>';
        card.querySelector(".deal-disc .big").textContent = d.discount;
        card.querySelector(".deal-disc .small").textContent = d.discLabel;
        card.querySelector(".tag.pf").textContent = pf.name;
        card.querySelectorAll(".tag")[1].textContent = catLabel(d.cat);
        card.querySelector("h3").textContent = d.title;
        card.querySelector(".cond").textContent = d.cond;
        card.querySelector(".exp span").textContent = expText;
        card.querySelector("code").textContent = d.code;
        var go = card.querySelector(".btn-go");
        go.href = pf.url;
        go.setAttribute("aria-label", "Mở " + pf.name + " để dùng mã " + d.code);
        var copyBtn = card.querySelector(".btn-copy");
        if (expired) {
          copyBtn.disabled = true;
          copyBtn.textContent = "Đã hết hạn";
          var goBtn = card.querySelector(".btn-go");
          goBtn.textContent = "Xem sàn";
        } else {
          copyBtn.addEventListener("click", function () { copyCode(d.code, this); });
        }
        var favBtn = card.querySelector(".btn-fav");
        function syncFav() {
          var on = !!favorites[d.code];
          favBtn.setAttribute("aria-pressed", on ? "true" : "false");
          favBtn.textContent = on ? "★ Đã lưu" : "☆ Lưu mã";
        }
        syncFav();
        favBtn.addEventListener("click", function () {
          if (favorites[d.code]) { delete favorites[d.code]; showToast("Đã bỏ lưu mã " + d.code); }
          else { favorites[d.code] = true; showToast("Đã lưu mã " + d.code + " — bấm “Mã đã lưu của tôi” để xem lại."); }
          updateFavCount();
          if (state.favOnly) render(); else syncFav();
        });
        card.querySelector(".btn-detail").addEventListener("click", function () { openModal(d); });
        return card;
      }
      function matches(d) {
        if (state.platform !== "all" && d.platform !== state.platform) return false;
        if (state.cat !== "all" && d.cat !== state.cat) return false;
        if (state.hotOnly && !d.hot) return false;
        if (state.urgentOnly && daysLeft(d.expires) > 3) return false;
        if (state.favOnly && !favorites[d.code]) return false;
        if (state.query) {
          var q = state.query.toLowerCase();
          var hay = (d.title + " " + d.code + " " + PLATFORMS[d.platform].name + " " + catLabel(d.cat)).toLowerCase();
          if (hay.indexOf(q) === -1) return false;
        }
        return true;
      }
      function sortDeals(list) {
        var arr = list.slice();
        function expW(d) { return isExpired(d) ? 1 : 0; }
        if (state.sort === "value") arr.sort(function (a, b) { return expW(a) - expW(b) || b.value - a.value; });
        else if (state.sort === "expiry") arr.sort(function (a, b) { return expW(a) - expW(b) || (a.expires < b.expires ? -1 : 1); });
        else arr.sort(function (a, b) { return expW(a) - expW(b) || (b.hot ? 1 : 0) - (a.hot ? 1 : 0) || b.value - a.value; });
        return arr;
      }
      function render() {
        var filtered = sortDeals(DEALS.filter(matches));
        grid.innerHTML = "";
        filtered.forEach(function (d) { grid.appendChild(dealCard(d)); });
        emptyState.hidden = filtered.length > 0;
        var hot = filtered.filter(function (d) { return !isExpired(d) && (d.hot || daysLeft(d.expires) <= 3); }).slice(0, 6);
        hotGrid.innerHTML = "";
        hot.forEach(function (d) { hotGrid.appendChild(dealCard(d)); });
        hotEmpty.hidden = hot.length > 0;
        var validCount = filtered.filter(function (d) { return !isExpired(d); }).length;
        var expiredCount = filtered.length - validCount;
        resultLine.innerHTML = "Đang hiển thị <b>" + validCount + "</b> mã mẫu còn hạn · " + expiredCount + " mã đã hết hạn (đã làm mờ, không copy được)" +
          (state.query ? ' cho từ khóa “' + state.query.replace(/</g, "&lt;") + '”' : "") +
          (state.favOnly ? " · chỉ mã đã lưu trong phiên này" : "");
        document.getElementById("statCount").textContent = DEALS.filter(function (d) { return !isExpired(d); }).length;
        document.getElementById("statExpired").textContent = DEALS.filter(function (d) { return isExpired(d); }).length;
        updateFavCount();
      }
      function updateFavCount() {
        document.getElementById("favCount").textContent = Object.keys(favorites).length;
      }

      /* Category chips */
      var catGroup = document.getElementById("catGroup");
      CATEGORIES.forEach(function (c) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "cat-chip";
        b.textContent = c.label;
        b.setAttribute("data-cat", c.key);
        b.setAttribute("aria-pressed", c.key === "all" ? "true" : "false");
        b.addEventListener("click", function () {
          state.cat = c.key;
          catGroup.querySelectorAll(".cat-chip").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
          render();
        });
        catGroup.appendChild(b);
      });
      /* Platform pills */
      document.querySelectorAll("[data-platform]").forEach(function (b) {
        b.addEventListener("click", function () { setPlatform(b.getAttribute("data-platform")); });
      });
      function setPlatform(p) {
        state.platform = p;
        document.querySelectorAll("[data-platform]").forEach(function (x) {
          x.setAttribute("aria-pressed", x.getAttribute("data-platform") === p ? "true" : "false");
        });
        render();
      }
      /* Hero shortcuts */
      document.querySelectorAll("[data-hero-platform]").forEach(function (b) {
        b.addEventListener("click", function () {
          setPlatform(b.getAttribute("data-hero-platform"));
          document.getElementById("tat-ca-ma").scrollIntoView({ behavior: "smooth" });
        });
      });
      var queryInput = document.getElementById("query");
      queryInput.addEventListener("input", function () { state.query = queryInput.value.trim(); render(); });
      document.getElementById("sort").addEventListener("change", function () { state.sort = this.value; render(); });
      document.getElementById("heroSearch").addEventListener("submit", function (e) {
        e.preventDefault();
        var v = document.getElementById("heroQuery").value.trim();
        state.query = v; queryInput.value = v;
        render();
        document.getElementById("tat-ca-ma").scrollIntoView({ behavior: "smooth" });
      });
      document.getElementById("resetFilters").addEventListener("click", function () {
        state.query = ""; queryInput.value = ""; document.getElementById("heroQuery").value = "";
        state.cat = "all"; state.hotOnly = false; state.urgentOnly = false; state.favOnly = false;
        ["tglHot", "tglUrgent", "tglFav"].forEach(function (id) { document.getElementById(id).setAttribute("aria-pressed", "false"); });
        catGroup.querySelectorAll(".cat-chip").forEach(function (x) { x.setAttribute("aria-pressed", x.getAttribute("data-cat") === "all" ? "true" : "false"); });
        setPlatform("all");
      });
      /* Advanced toggles + favorites nav */
      function bindToggle(id, key) {
        var el = document.getElementById(id);
        el.addEventListener("click", function () {
          state[key] = !state[key];
          el.setAttribute("aria-pressed", state[key] ? "true" : "false");
          render();
        });
      }
      bindToggle("tglHot", "hotOnly");
      bindToggle("tglUrgent", "urgentOnly");
      bindToggle("tglFav", "favOnly");
      document.getElementById("favNavLink").addEventListener("click", function () {
        if (!state.favOnly) { state.favOnly = true; document.getElementById("tglFav").setAttribute("aria-pressed", "true"); render(); }
      });

      /* ---------- MODAL CHI TIẾT MÃ ---------- */
      var backdrop = document.getElementById("modalBackdrop");
      var modalCard = document.getElementById("modalCard");
      var modalDeal = null;
      function fmtMoney(k) { return k === 0 ? "Không yêu cầu tối thiểu" : k.toLocaleString("vi-VN") + "K VNĐ (từ " + (k * 1000).toLocaleString("vi-VN") + "đ)"; }
      function openModal(d) {
        modalDeal = d;
        modalCard.className = "modal pf-" + d.platform;
        document.getElementById("mPlatform").textContent = PLATFORMS[d.platform].name;
        document.getElementById("mCat").textContent = catLabel(d.cat);
        document.getElementById("mTitle").textContent = d.title;
        document.getElementById("mDisc").textContent = d.discount + " · " + d.discLabel;
        document.getElementById("mCond").textContent = d.cond;
        document.getElementById("mMin").textContent = fmtMoney(d.min);
        var dl = daysLeft(d.expires);
        document.getElementById("mExp").textContent = fmtDate(d.expires) + (isExpired(d) ? " (đã hết hạn — không copy được)" : " (còn " + dl + " ngày)");
        document.getElementById("mCode").textContent = d.code;
        var mCopyBtn = document.getElementById("mCopy");
        if (isExpired(d)) { mCopyBtn.disabled = true; mCopyBtn.textContent = "Đã hết hạn"; }
        else { mCopyBtn.disabled = false; mCopyBtn.textContent = "Copy"; }
        var go = document.getElementById("mGo");
        go.href = PLATFORMS[d.platform].url;
        go.setAttribute("aria-label", "Mở " + PLATFORMS[d.platform].name + " để dùng mã " + d.code);
        backdrop.classList.add("open");
        document.getElementById("mClose").focus();
      }
      function closeModal() { backdrop.classList.remove("open"); modalDeal = null; }
      document.getElementById("mClose").addEventListener("click", closeModal);
      backdrop.addEventListener("click", function (e) { if (e.target === backdrop) closeModal(); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape" && backdrop.classList.contains("open")) closeModal(); });
      document.getElementById("mCopy").addEventListener("click", function () { if (modalDeal) copyCode(modalDeal.code, this); });

      /* ---------- MÁY TÍNH TIẾT KIỆM ---------- */
      document.getElementById("calcForm").addEventListener("submit", function (e) {
        e.preventDefault();
        var amount = parseFloat(document.getElementById("calcAmount").value);
        var pf = document.getElementById("calcPlatform").value;
        var box = document.getElementById("calcResult");
        box.innerHTML = "";
        if (!amount || amount <= 0) {
          var warn = document.createElement("p");
          warn.className = "calc-none";
          warn.textContent = "Nhập giá trị đơn lớn hơn 0 để mình đối chiếu mã giúp bạn.";
          box.appendChild(warn);
          return;
        }
        var amountK = amount / 1000;
        var fits = DEALS.filter(function (d) {
          return (pf === "all" || d.platform === pf) && d.min <= amountK && !isExpired(d);
        }).sort(function (a, b) { return b.value - a.value; }).slice(0, 5);
        if (!fits.length) {
          var none = document.createElement("p");
          none.className = "calc-none";
          none.textContent = "Chưa có mã mẫu nào áp được cho đơn mức này — thử tăng giá trị đơn hoặc chọn sàn khác.";
          box.appendChild(none);
          return;
        }
        fits.forEach(function (d) {
          var save = Math.min(d.value, amountK);
          var item = document.createElement("div");
          item.className = "calc-item";
          var left = document.createElement("div");
          var nm = document.createElement("div"); nm.className = "ci-name"; nm.textContent = PLATFORMS[d.platform].name + " — " + d.title;
          var cd = document.createElement("div"); cd.className = "ci-code"; cd.textContent = "Mã " + d.code + " · đơn tối thiểu " + d.min + "K · hết hạn " + fmtDate(d.expires);
          left.appendChild(nm); left.appendChild(cd);
          var sv = document.createElement("div"); sv.className = "ci-save"; sv.textContent = "−" + save + "K";
          item.appendChild(left); item.appendChild(sv);
          box.appendChild(item);
        });
      });

      /* ---------- CHIA SẺ TRANG (Web Share API — không đọc địa chỉ trang) ---------- */
      document.querySelectorAll("[data-share]").forEach(function (b) {
        b.addEventListener("click", function () {
          var mode = b.getAttribute("data-share");
          var shareText = "Săn mã giảm giá Shopee, Lazada & TikTok Shop: mã ghi rõ hạn dùng và điều kiện, lọc theo sàn và nhu cầu, copy 1 chạm, không cần đăng nhập.";
          if (mode === "copy") {
            showToast("Hãy dùng nút chia sẻ của trình duyệt/ứng dụng để sao chép và gửi link trang này cho bạn bè.");
            return;
          }
          if (navigator.share) {
            navigator.share({ title: document.title, text: shareText }).catch(function () {});
          } else {
            showToast("Thiết bị này không hỗ trợ chia sẻ nhanh — hãy dùng nút chia sẻ của trình duyệt để gửi trang cho bạn bè qua " + (mode === "zalo" ? "Zalo" : "Facebook") + ".");
          }
        });
      });

      /* Countdown — tự chuyển sang đợt sale tiếp theo khi qua mốc */
      var SALES = [
        { date: "2026-11-11T00:00:00+07:00", title: "Đếm ngược tới siêu sale 11.11", sub: "Thứ Tư, 11/11/2026 — đợt sale lớn nhất năm trên cả 3 sàn. Chuẩn bị giỏ hàng và sưu tầm mã từ bây giờ." },
        { date: "2026-11-27T00:00:00+07:00", title: "Đếm ngược tới Black Friday", sub: "Thứ Sáu, 27/11/2026 — thương hiệu quốc tế, điện tử và thời trang giảm mạnh trong 24–72 giờ." },
        { date: "2026-12-12T00:00:00+07:00", title: "Đếm ngược tới siêu sale 12.12", sub: "Thứ Bảy, 12/12/2026 — đợt sale chốt năm, phù hợp mua quà cuối năm và tích trữ hàng tiêu dùng." }
      ];
      var saleIdx = 0;
      while (saleIdx < SALES.length - 1 && new Date(SALES[saleIdx].date).getTime() <= Date.now()) saleIdx++;
      document.getElementById("sbTitle").textContent = SALES[saleIdx].title;
      document.getElementById("sbSub").textContent = SALES[saleIdx].sub;
      document.querySelector(".cd").setAttribute("aria-label", SALES[saleIdx].title);
      var target = new Date(SALES[saleIdx].date).getTime();
      function pad(n) { return (n < 10 ? "0" : "") + n; }
      function tick() {
        var diff = Math.max(0, target - Date.now());
        var d = Math.floor(diff / 86400000);
        var h = Math.floor(diff % 86400000 / 3600000);
        var m = Math.floor(diff % 3600000 / 60000);
        var s = Math.floor(diff % 60000 / 1000);
        document.getElementById("cdD").textContent = pad(d);
        document.getElementById("cdH").textContent = pad(h);
        document.getElementById("cdM").textContent = pad(m);
        document.getElementById("cdS").textContent = pad(s);
      }
      tick();
      setInterval(tick, 1000);

      /* ---------- ĐĂNG KÝ NHẬN MÃ QUA EMAIL ----------
         Không có máy chủ lưu trữ: nút gửi chỉ mở ứng dụng email của chính
         người dùng (mailto:) với nội dung soạn sẵn; người dùng tự bấm Gửi. */
      var regError = document.getElementById("regError");
      var regStatus = document.getElementById("regStatus");
      function regData() {
        var email = document.getElementById("regEmail").value.trim();
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          regError.textContent = "Vui lòng nhập một địa chỉ email hợp lệ để đăng ký nhận thông báo.";
          regError.hidden = false;
          regStatus.textContent = "";
          return null;
        }
        regError.hidden = true;
        return {
          name: document.getElementById("regName").value.trim(),
          email: email,
          platform: document.getElementById("regPlatform").value,
          consent: document.getElementById("regConsent").checked
        };
      }
      function regSummary(d) {
        return "Đăng ký nhận mã giảm giá & lịch sale\n" +
          "Tên: " + (d.name || "(không cung cấp)") + "\n" +
          "Email: " + d.email + "\n" +
          "Sàn quan tâm: " + d.platform + "\n" +
          "Đồng ý nhận email thông báo mã & lịch sale: " + (d.consent ? "Có" : "Chưa chọn");
      }
      document.getElementById("regMailBtn").addEventListener("click", function () {
        var d = regData();
        if (!d) return;
        var mailLink = document.createElement("a");
        mailLink.href = "mailto:?subject=" + encodeURIComponent("Đăng ký nhận mã sale") +
          "&body=" + encodeURIComponent(regSummary(d));
        document.body.appendChild(mailLink);
        mailLink.click();
        document.body.removeChild(mailLink);
        regStatus.textContent = "Đã mở ứng dụng email trên máy bạn với nội dung soạn sẵn — hãy kiểm tra và tự bấm Gửi trong ứng dụng email để hoàn tất. Nếu ứng dụng email chưa bật, hãy dùng nút “Sao chép thông tin đăng ký”. Trang không lưu thông tin này.";
      });
      document.getElementById("regCopyBtn").addEventListener("click", function () {
        var d = regData();
        if (!d) return;
        var text = regSummary(d);
        function doneCopy() {
          regStatus.textContent = "Đã sao chép thông tin đăng ký — bạn có thể dán vào email và tự gửi. Trang không lưu thông tin này.";
          showToast("Đã sao chép thông tin đăng ký");
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(doneCopy, function () {
            regStatus.textContent = "Không sao chép tự động được. Thông tin đăng ký của bạn:\n" + text;
          });
        } else {
          regStatus.textContent = "Thông tin đăng ký của bạn:\n" + text;
        }
      });

      render();
