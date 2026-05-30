<div align="center">

# ✈️ TravelBook – Nền Tảng Đặt Lịch Du Lịch

**Đặt khách sạn · Tour du lịch · Hướng dẫn viên**

![Node.js](https://img.shields.io/badge/Node.js-≥18-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)

</div>

---

## 📋 Mục Lục

- [Tổng Quan](#-tổng-quan)
- [Tính Năng](#-tính-năng)
- [Kiến Trúc Hệ Thống](#-kiến-trúc-hệ-thống)
- [Tech Stack](#-tech-stack)
- [Cấu Trúc Dự Án](#-cấu-trúc-dự-án)
- [Cài Đặt & Chạy](#-cài-đặt--chạy)
- [Biến Môi Trường](#-biến-môi-trường)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)
- [Phát Triển](#-phát-triển)
- [Đóng Góp](#-đóng-góp)
- [Giấy Phép](#-giấy-phép)

---

## 🌏 Tổng Quan

**TravelBook** là nền tảng đặt lịch du lịch trực tuyến toàn diện, cho phép người dùng tìm kiếm và đặt khách sạn, tham gia tour du lịch, và thuê hướng dẫn viên. Hệ thống hỗ trợ đa vai trò (khách hàng, chủ khách sạn, hướng dẫn viên, quản trị viên) với quy trình booking hoàn chỉnh từ tìm kiếm → đặt chỗ → thanh toán → đánh giá.

---

## ✨ Tính Năng

### 👤 Người Dùng
- Đăng ký / Đăng nhập 
- Quản lý hồ sơ cá nhân
- Lịch sử đặt chỗ, hủy booking
- Đánh giá & nhận xét (kèm ảnh)

### 🏨 Khách Sạn
- Tìm kiếm theo thành phố, xếp hạng sao, khoảng giá
- Xem chi tiết phòng, tiện nghi, hình ảnh
- Huy hiệu "Đã xác minh" cho khách sạn uy tín
- Chủ khách sạn tự quản lý thông tin & phòng

### 🗺️ Tour Du Lịch
- Duyệt tour theo danh mục (Biển, Núi, Văn hóa, Ẩm thực, Phiêu lưu)
- Lọc theo điểm đến, số ngày, mức giá
- Tour nổi bật (Featured) hiển thị trang chủ
- Lịch trình chi tiết từng ngày

### 🧑‍🏫 Hướng Dẫn Viên
- Hồ sơ hướng dẫn viên với ngôn ngữ, chuyên môn
- Lịch trống (Calendar) để đặt lịch
- Xác minh hướng dẫn viên bởi admin

### 💳 Booking & Thanh Toán
- Quy trình đặt chỗ đa bước (chọn → xác nhận → thanh toán)
- Hỗ trợ 3 loại: Khách sạn, Tour, Hướng dẫn viên
- Tích hợp VNPay / Momo (tùy chọn)
- Trạng thái booking: Pending → Confirmed → Completed / Cancelled

### 🛡️ Quản Trị (Admin)
- Dashboard tổng quan
- Quản lý người dùng, khách sạn, tour, hướng dẫn viên
- Xác minh (verify) khách sạn & hướng dẫn viên
- Quản lý tất cả bookings

---

## 🛠️ Tech Stack

### Backend

| Công nghệ | Mục đích |
|:---|:---|
| **Node.js ≥ 18** | Runtime |
| **Express 4** | Web framework |
| **Sequelize 6** | ORM cho MySQL |
| **MySQL 8** | Cơ sở dữ liệu |
| **JWT** | Xác thực (Access + Refresh Token) |
| **bcryptjs** | Mã hóa mật khẩu |
| **Multer** | Upload file (ảnh) |
| **Helmet** | Bảo mật HTTP headers |
| **express-rate-limit** | Giới hạn request |
| **express-validator** | Validate dữ liệu đầu vào |
| **Winston** | Logging |
| **Morgan** | HTTP request logging |
| **Nodemailer** | Gửi email |

### Frontend

| Công nghệ | Mục đích |
|:---|:---|
| **React 18** | UI Library |
| **Vite 5** | Build tool & Dev server |
| **React Router 6** | Client-side routing |
| **TanStack React Query 5** | Server state & caching |
| **Zustand** | Client state management |
| **Axios** | HTTP client |
| **React Icons** | Icon library |
| **React Hot Toast** | Thông báo (toast) |
| **Swiper / React Slick** | Carousel & slider |
| **date-fns** | Xử lý ngày tháng |
| **React Datepicker** | Chọn ngày |

---

## 📂 Cấu Trúc Dự Án

```
Booking_travel/
├── Backend/
│   ├── src/
│   │   ├── app.js                 # Entry point, middleware setup
│   │   ├── config/
│   │   │   ├── database.js        # Sequelize connection config
│   │   │   └── jwt.js             # JWT config & helpers
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── hotel.controller.js
│   │   │   ├── tour.controller.js
│   │   │   ├── guide.controller.js
│   │   │   ├── booking.controller.js
│   │   │   └── review.controller.js
│   │   ├── middleware/
│   │   │   ├── auth.js            # JWT verification middleware
│   │   │   ├── errorHandler.js    # Global error handler
│   │   │   └── upload.js          # Multer file upload config
│   │   ├── models/
│   │   │   ├── index.js           # Model associations
│   │   │   ├── User.js
│   │   │   ├── Hotel.js
│   │   │   ├── Tour.js
│   │   │   ├── Guide.js
│   │   │   ├── Booking.js
│   │   │   └── Review.js
│   │   ├── routes/
│   │   │   ├── index.js           # Route aggregator
│   │   │   ├── auth.routes.js
│   │   │   ├── hotel.routes.js
│   │   │   ├── tour.routes.js
│   │   │   ├── guide.routes.js
│   │   │   ├── booking.routes.js
│   │   │   └── review.routes.js
│   │   ├── services/              # Business logic layer
│   │   ├── validators/            # Request validation rules
│   │   └── utils/                 # Logger, helpers
│   ├── uploads/                   # Uploaded images
│   ├── logs/                      # Application logs
│   ├── .env                       # Environment variables
│   └── package.json
│
├── Frontend/
│   ├── public/                    # Static assets
│   ├── src/
│   │   ├── main.jsx               # React bootstrap
│   │   ├── App.jsx                # Root component
│   │   ├── routes/
│   │   │   └── AppRouter.jsx      # All routes + PrivateRoute
│   │   ├── context/
│   │   │   ├── AuthContext.jsx    # Auth state (useReducer)
│   │   │   └── BookingContext.jsx # Multi-step booking flow
│   │   ├── services/
│   │   │   ├── api.js             # Axios instance + interceptors
│   │   │   ├── auth.service.js    # Auth API calls
│   │   │   └── index.js           # Hotel/Tour/Guide/Booking/Review services
│   │   ├── hooks/
│   │   │   ├── useAuth.js         # Auth hook alias
│   │   │   └── useFetch.js        # Generic data fetching
│   │   ├── components/
│   │   │   ├── common/            # Navbar, Footer
│   │   │   ├── auth/              # Login/Register forms
│   │   │   ├── booking/           # Booking flow components
│   │   │   ├── hotel/             # Hotel cards, filters
│   │   │   ├── tour/              # Tour cards, filters
│   │   │   └── guide/             # Guide cards, profiles
│   │   ├── pages/
│   │   │   ├── Home/              # Landing page
│   │   │   ├── Hotels/            # Listing + Detail
│   │   │   ├── Tours/             # Listing + Detail
│   │   │   ├── Guides/            # Listing + Detail
│   │   │   ├── Auth/              # Login, Register
│   │   │   ├── Booking/           # Booking flow + Success
│   │   │   ├── Dashboard/         # User dashboard
│   │   │   └── Admin/             # Admin panel
│   │   ├── styles/
│   │   │   ├── variables.css      # Design tokens (colors, spacing, etc.)
│   │   │   └── global.css         # Global styles, utilities
│   │   └── assets/                # Images, fonts
│   ├── index.html                 # HTML entry point
│   ├── vite.config.js             # Vite + path aliases
│   ├── .env                       # Frontend env vars
│   └── package.json
│
└── README.md                      # ← Bạn đang đọc file này
```

---

## 🚀 Cài Đặt & Chạy

### Yêu Cầu Hệ Thống

- **Node.js** ≥ 18.0.0
- **MySQL** ≥ 8.0
- **npm** ≥ 9.0 hoặc **yarn**

### 1. Clone Repository

```bash
git clone https://github.com/TungSonn/Booking_travel.git
cd Booking_travel
```

### 2. Cài Đặt Backend

```bash
cd Backend

# Cài dependencies
npm install

# Tạo file .env từ template (hoặc chỉnh sửa .env có sẵn)
# Cấu hình thông tin MySQL, JWT secret, email...
# Xem phần "Biến Môi Trường" bên dưới

# Tạo database MySQL
mysql -u root -p -e "CREATE DATABASE booking_travel_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Chạy server (development mode - auto-sync models)
npm run dev
```

> **Lưu ý:** Ở `NODE_ENV=development`, Sequelize sẽ tự động sync (alter) schema. Trong production, hãy sử dụng migrations.

### 3. Cài Đặt Frontend

```bash
cd Frontend

# Cài dependencies
npm install

# Chạy dev server
npm run dev
```

### 4. Truy Cập Ứng Dụng

| Service | URL |
|:---|:---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000/api |
| Health Check | http://localhost:5000/health |

---

## 🔐 Biến Môi Trường

### Backend (`.env`)

```env
# Server
PORT=5000
NODE_ENV=development

# Database (MySQL)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=booking_travel_db

# JWT
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_secret_key_here
JWT_REFRESH_EXPIRES_IN=30d

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM="TravelBook <noreply@travelbook.vn>"

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# CORS
FRONTEND_URL=http://localhost:3000

# Payment (tùy chọn)
VNPAY_TMN_CODE=
VNPAY_HASH_SECRET=
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:5000/api/payments/vnpay/return
```

### Frontend (`.env`)

```env
VITE_API_URL=http://localhost:5000/api
VITE_UPLOAD_URL=http://localhost:5000/uploads
VITE_APP_NAME=TravelBook
VITE_APP_VERSION=1.0.0
```

---

## 📡 API Endpoints

Tất cả endpoints có prefix `/api`. Base URL: `http://localhost:5000/api`

### 🔑 Authentication (`/api/auth`)

| Method | Endpoint | Mô tả | Auth |
|:---|:---|:---|:---:|
| `POST` | `/auth/register` | Đăng ký tài khoản | ❌ |
| `POST` | `/auth/login` | Đăng nhập | ❌ |
| `POST` | `/auth/refresh` | Làm mới access token | 🔄 |
| `GET` | `/auth/me` | Lấy thông tin user hiện tại | ✅ |
| `PUT` | `/auth/profile` | Cập nhật hồ sơ | ✅ |
| `PUT` | `/auth/change-password` | Đổi mật khẩu | ✅ |

### 🏨 Hotels (`/api/hotels`)

| Method | Endpoint | Mô tả | Auth |
|:---|:---|:---|:---:|
| `GET` | `/hotels` | Danh sách khách sạn (filter, pagination) | ❌ |
| `GET` | `/hotels/:slug` | Chi tiết khách sạn | ❌ |
| `GET` | `/hotels/:id/rooms` | Danh sách phòng | ❌ |
| `POST` | `/hotels` | Tạo khách sạn mới | ✅ |
| `PUT` | `/hotels/:id` | Cập nhật khách sạn | ✅ |
| `DELETE` | `/hotels/:id` | Xóa khách sạn | ✅ |
| `PATCH` | `/hotels/:id/verify` | Xác minh khách sạn | 🔒 Admin |

### 🗺️ Tours (`/api/tours`)

| Method | Endpoint | Mô tả | Auth |
|:---|:---|:---|:---:|
| `GET` | `/tours` | Danh sách tour (filter, pagination) | ❌ |
| `GET` | `/tours/featured` | Tour nổi bật | ❌ |
| `GET` | `/tours/:slug` | Chi tiết tour | ❌ |
| `GET` | `/tours/:id/schedules` | Lịch trình tour | ❌ |
| `POST` | `/tours` | Tạo tour mới | ✅ |
| `PUT` | `/tours/:id` | Cập nhật tour | ✅ |
| `DELETE` | `/tours/:id` | Xóa tour | ✅ |
| `PATCH` | `/tours/:id/feature` | Bật/tắt nổi bật | 🔒 Admin |

### 🧑‍🏫 Guides (`/api/guides`)

| Method | Endpoint | Mô tả | Auth |
|:---|:---|:---|:---:|
| `GET` | `/guides` | Danh sách hướng dẫn viên | ❌ |
| `GET` | `/guides/:id` | Chi tiết hướng dẫn viên | ❌ |
| `GET` | `/guides/:id/calendar` | Lịch trống | ❌ |
| `POST` | `/guides/profile` | Tạo hồ sơ HDV | ✅ |
| `PUT` | `/guides/profile` | Cập nhật hồ sơ HDV | ✅ |
| `PATCH` | `/guides/:id/verify` | Xác minh HDV | 🔒 Admin |
| `DELETE` | `/guides/:id` | Xóa HDV | 🔒 Admin |

### 📋 Bookings (`/api/bookings`)

| Method | Endpoint | Mô tả | Auth |
|:---|:---|:---|:---:|
| `POST` | `/bookings` | Tạo booking mới | ✅ |
| `GET` | `/bookings` | Bookings của tôi | ✅ |
| `GET` | `/bookings/:id` | Chi tiết booking | ✅ |
| `PATCH` | `/bookings/:id/cancel` | Hủy booking | ✅ |
| `PATCH` | `/bookings/:id/confirm` | Xác nhận booking | ✅ |
| `PATCH` | `/bookings/:id/complete` | Hoàn thành booking | ✅ |
| `POST` | `/bookings/:id/payment` | Khởi tạo thanh toán | ✅ |
| `GET` | `/bookings/admin/all` | Tất cả bookings | 🔒 Admin |

### ⭐ Reviews (`/api/reviews`)

| Method | Endpoint | Mô tả | Auth |
|:---|:---|:---|:---:|
| `GET` | `/reviews/hotel/:hotelId` | Đánh giá khách sạn | ❌ |
| `GET` | `/reviews/tour/:tourId` | Đánh giá tour | ❌ |
| `GET` | `/reviews/guide/:guideId` | Đánh giá hướng dẫn viên | ❌ |
| `POST` | `/reviews` | Tạo đánh giá | ✅ |
| `PATCH` | `/reviews/:id/reply` | Trả lời đánh giá | ✅ |
| `PATCH` | `/reviews/:id/helpful` | Đánh dấu hữu ích | ✅ |
| `DELETE` | `/reviews/:id` | Xóa đánh giá | ✅ |

> **Chú thích:** ❌ Không cần auth · ✅ Cần đăng nhập · 🔄 Cần refresh token · 🔒 Chỉ admin

---

## 🗄️ Database Schema

### Entity Relationship

```
┌──────────┐     1:N      ┌──────────┐     1:N      ┌──────────┐
│   User   │─────────────→│  Hotel   │─────────────→│  Review  │
│          │              │          │              │          │
│ id       │   owner_id   │ id       │   hotel_id   │ id       │
│ name     │              │ name     │              │ rating   │
│ email    │              │ slug     │              │ comment  │
│ password │              │ city     │              │ images   │
│ role     │              │ stars    │              └──────────┘
│ avatar   │              │ verified │                   ▲
└──────┬───┘              └──────────┘                   │
       │                                                 │
       │ 1:1              ┌──────────┐    1:N            │
       ├────────────────→ │  Guide   │───────────────────┤
       │   user_id        │          │   guide_id        │
       │                  │ id       │                   │
       │                  │ languages│                   │
       │                  │ verified │                   │
       │                  └────┬─────┘                   │
       │                       │ M:N                     │
       │                  ┌────┴─────┐                   │
       │                  │tour_guides│                  │
       │                  └────┬─────┘                   │
       │                       │                         │
       │ 1:N              ┌────┴─────┐    1:N            │
       ├────────────────→ │   Tour   │───────────────────┘
       │   (via booking)  │          │   tour_id
       │                  │ id       │
       │                  │ name     │
       │                  │ slug     │
       │                  │ featured │
       │                  └──────────┘
       │
       │ 1:N              ┌──────────┐
       └────────────────→ │ Booking  │
          user_id         │          │
                          │ id       │
                          │ type     │  ← hotel | tour | guide
                          │ status   │  ← pending | confirmed | completed | cancelled
                          │ total    │
                          │ hotel_id │  (nullable)
                          │ tour_id  │  (nullable)
                          │ guide_id │  (nullable)
                          └──────────┘
```

### Vai Trò Người Dùng (Roles)

| Role | Quyền hạn |
|:---|:---|
| `customer` | Đặt chỗ, đánh giá, quản lý booking cá nhân |
| `hotel_owner` | Quản lý khách sạn riêng, xem booking |
| `guide` | Quản lý hồ sơ HDV, lịch trống |
| `admin` | Toàn quyền: xác minh, quản lý tất cả dữ liệu |

---

## 👨‍💻 Phát Triển

### Scripts

#### Backend

```bash
npm run dev       # Chạy với nodemon (auto-restart)
npm start         # Chạy production
npm run migrate   # Chạy database migrations
npm run seed      # Seed dữ liệu mẫu
```

#### Frontend

```bash
npm run dev       # Chạy Vite dev server (HMR)
npm run build     # Build production bundle
npm run preview   # Preview production build
npm run lint      # Chạy ESLint
```

### Path Aliases (Frontend)

Vite được cấu hình với các alias để import gọn gàng:

```javascript
import Navbar   from '@components/common/Navbar';
import useAuth  from '@hooks/useAuth';
import api      from '@services/api';
import HomePage from '@pages/Home';
```

| Alias | Đường dẫn |
|:---|:---|
| `@` | `./src` |
| `@components` | `./src/components` |
| `@pages` | `./src/pages` |
| `@hooks` | `./src/hooks` |
| `@services` | `./src/services` |
| `@context` | `./src/context` |
| `@styles` | `./src/styles` |
| `@assets` | `./src/assets` |
| `@utils` | `./src/utils` |

### Quy Ước Code

- **Backend:** CommonJS (`require` / `module.exports`)
- **Frontend:** ESM (`import` / `export`)
- **Naming:** camelCase cho biến/hàm, PascalCase cho components
- **Files:** kebab-case cho routes/services, PascalCase cho components/models

---

## 🔒 Bảo Mật

Dự án áp dụng các biện pháp bảo mật:

- **Helmet** – Thiết lập HTTP security headers
- **CORS** – Giới hạn origin cho phép
- **Rate Limiting** – 100 requests / 15 phút / IP
- **JWT** – Access token (7 ngày) + Refresh token (30 ngày)
- **bcryptjs** – Hash mật khẩu trước khi lưu DB
- **express-validator** – Validate & sanitize tất cả input
- **Multer** – Giới hạn kích thước file upload (5MB)

---

## 🤝 Đóng Góp

1. Fork repository
2. Tạo branch mới: `git checkout -b feature/ten-tinh-nang`
3. Commit: `git commit -m "feat: mô tả tính năng"`
4. Push: `git push origin feature/ten-tinh-nang`
5. Tạo Pull Request

### Commit Convention

```
feat:     Tính năng mới
fix:      Sửa lỗi
docs:     Cập nhật tài liệu
style:    Format code (không ảnh hưởng logic)
refactor: Tái cấu trúc code
test:     Thêm/sửa test
chore:    Công việc bảo trì (config, scripts...)
```

---

## 📄 Giấy Phép

Dự án được phân phối dưới giấy phép **MIT**. Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

---

<div align="center">

**Được xây dựng với ❤️ bởi TungSonn**

</div>
