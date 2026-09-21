# 👗 LUXE FASHION - E-COMMERCE & ADMIN REVENUE DASHBOARD

Website thương mại điện tử thời trang hiện đại tích hợp hệ thống phân quyền Đăng nhập (Admin & User) và Bảng điều khiển quản lý doanh thu thời gian thực.

---

## 🚀 Các Tính Năng Nổi Bật

### 1. 📊 Bảng Điều Khiển Doanh Thu Quản Trị (`admin-dashboard.html`)
- **Thẻ chỉ số KPI tài chính**:
  - Tổng doanh thu tháng: 185.450.000₫ (+14.2%)
  - Tổng đơn hàng: 1.428 đơn (+8.5%)
  - Khách hàng mới: 382 người (+12.3%)
  - Giá trị đơn trung bình (AOV): 425.000₫ (+3.8%)
- **Biểu đồ trực quan (Chart.js)**:
  - Biểu đồ đường phân tích xu hướng doanh thu theo Tuần / Tháng / Năm.
  - Biểu đồ tròn thể hiện tỷ trọng doanh số theo danh mục (Áo khoác, Áo sơ mi, Áo thun, Quần, Váy đầm).
- **Quản lý đơn hàng & Top sản phẩm**: Bảng danh sách đơn hàng mới nhất với trạng thái xử lý sống động và danh mục thời trang bán chạy nhất.

### 2. 🛍️ Cửa Hàng Thời Trang Quần Áo (`shop.html`)
- Giao diện Lookbook chuẩn thời trang cao cấp 2026.
- Bộ lọc danh mục tức thì: Áo sơ mi, Áo thun & Polo, Áo khoác & Blazer, Quần Jean/Tây, Váy đầm.
- Ô tìm kiếm thời gian thực theo tên trang phục.
- Modal xem chi tiết sản phẩm: Tùy chọn Size (S/M/L/XL), Màu sắc và Số lượng.
- Giỏ hàng trượt (Slide-over Cart Drawer): Tăng giảm số lượng, xóa món đồ, tính tổng tiền VND và mô phỏng đặt hàng COD.

---

## 💻 Hướng Dẫn Chạy Website

### Cách 1: Chạy bằng Node.js Server (Khuyên dùng)
Chạy lệnh sau tại thư mục dự án:
```powershell
node server.js
```
Hoặc:
```powershell
npm start
```
Sau đó truy cập trên trình duyệt: **`http://localhost:3000`**

### Cách 2: Mở trực tiếp bằng Trình Duyệt Web
Bạn có thể mở trực tiếp file `index.html` bằng bất kỳ trình duyệt nào (Chrome, Edge, Firefox, Cốc Cốc, Brave,...).

### Cách 3: Chạy bằng Docker (DevOps)
```bash
docker-compose up -d --build
```
Truy cập: **`http://localhost:3000`**

---

## 📁 Cấu Trúc Mã Nguồn
```
E-CommerceWeb/
├── index.html              # Trang Đăng nhập phân quyền
├── admin-dashboard.html    # Dashboard quản trị doanh thu
├── shop.html               # Trang bán hàng quần áo
├── assets/
│   ├── css/
│   │   └── styles.css      # CSS tùy chỉnh giao diện
│   └── js/
│       ├── auth.js         # Phân quyền và phiên đăng nhập
│       ├── products.js     # Dữ liệu sản phẩm thời trang mẫu
│       ├── shop.js         # Logic giỏ hàng & sản phẩm
│       └── dashboard.js    # Logic vẽ biểu đồ Chart.js
├── server.js               # Node.js HTTP server tĩnh
├── package.json            # Cấu hình dự án
├── Dockerfile              # Container image
└── docker-compose.yml      # Orchestration
```
