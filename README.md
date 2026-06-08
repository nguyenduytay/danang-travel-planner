# ✈️ Danang Travel Planner - Lịch Trình & Gợi Ý Khám Phá Đà Nẵng

Trang web đơn (Single Page App - SPA) giao diện tối (Dark Mode Premium) kết hợp Glassmorphic UI giúp theo dõi lịch trình khám phá Đà Nẵng chi tiết 4 ngày 3 đêm, đồng thời tra cứu danh sách các địa điểm ăn uống, cafe, check-in, vui chơi giải trí địa phương vô cùng trực quan.

## 🌟 Tính năng nổi bật
- **Lịch trình Timeline chi tiết**: Chia lộ trình rõ ràng theo Ngày 1 -> Ngày 4 và các buổi Sáng, Trưa, Chiều, Tối với số thứ tự điểm dừng cụ thể.
- **Tích hợp Sự kiện hè 2026**: Các sự kiện đặc biệt (như Lễ hội Pháo hoa DIFF 2026, An Hải Festival) được hiển thị nổi bật với viền phát sáng màu hồng ngoại (neon) dễ nhận diện.
- **Bản đồ Google Maps tức thì**: Bấm vào bất kỳ thẻ hoạt động/địa điểm nào hoặc nút **Bản đồ** để mở nhanh Google Maps chỉ đường bằng GPS trên điện thoại hoặc máy tính.
- **Bộ lọc thông minh**: Tìm kiếm thời gian thực, lọc theo danh mục (Ăn uống, Cafe, Check-in, Vui chơi) hoặc xem các địa điểm đang nổi tiếng trên TikTok (TikTok Hot 🔥).
- **Hỗ trợ tối đa trên Di động**: Giao diện Responsive thích ứng tuyệt đối, tải cực nhanh ngoại tuyến (Offline) khi đang đi du lịch ngoài đường nhờ toàn bộ dữ liệu được lưu tĩnh, không lo về CORS.

## 📂 Cấu trúc dự án
- `index.html`: Giao diện chính của Dashboard.
- `style.css`: Hệ thống thiết kế CSS (tone màu biển sâu, glassmorphism, responsive).
- `data.js`: Cơ sở dữ liệu JSON lưu trữ lịch trình (`ITINERARY`), địa điểm gợi ý (`RECOMMENDATIONS`) và sự kiện (`EVENTS`).
- `app.js`: Xử lý logic tìm kiếm, bộ lọc, chuyển đổi ngày và các tương tác người dùng.
- `danang_banner.png`: Banner ảnh nền tiêu đề Đà Nẵng.
- `parse_csv.js` & `update_data_and_csv.js`: Các script Node.js hỗ trợ tự động hóa việc đồng bộ dữ liệu từ tệp CSV gốc.

## 🛠️ Hướng dẫn cập nhật dữ liệu từ CSV
Nếu bạn thay đổi hoặc bổ sung lịch trình trong tệp `schedule.csv` (ở thư mục cha), chỉ cần chạy lệnh sau để tự động cập nhật dữ liệu của trang web:
```bash
node update_data_and_csv.js
```

## 🌐 Chạy ứng dụng
- **Ngoại tuyến (Offline)**: Nhấp đúp chuột trực tiếp vào tệp `index.html` trên máy tính hoặc điện thoại.
- **Trực tuyến (Online)**: Đẩy mã nguồn lên GitHub và kích hoạt **GitHub Pages** để nhận link trang web cá nhân miễn phí!
