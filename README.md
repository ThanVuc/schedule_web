# 🧩 Dự án Web App – Cấu trúc thư mục & Hướng dẫn phát triển

## 📂 Cấu trúc thư mục chính

```
.
├── public/               # Các tài nguyên tĩnh như ảnh, favicon, v.v.
├── src/                  
│   ├── app/              # Next.js App Router – cấu trúc các trang
│   │   ├── (auth)/       # 📈 Các trang xác thực (login, register, forgot-password, v.v.)
│   │   ├── (landing)/    # 🏠 Trang giới thiệu, landing page, homepage
│   │   ├── (main)/       # 📄 Các trang chính sau khi đăng nhập (dashboard, nội dung chính)
│   │   └── test/         # 🧪 Trang hoặc module test/demo tạm thời
│   ├── components/       # 🧱 Các component dùng lại (button, navbar, modal, ...)
│   ├── middleware/       # 🧱 Các middleware để sử dụng
│   ├── hooks/            # 🦡 Các custom React hooks (useAuth, useFetch, ...)
│   ├── lib/              # 📚 Thư viện hỗ trợ (API client, hàm xử lý chung)
│   ├── logs/             # 📝 Ghi log hệ thống, debug, hoặc xử lý lỗi
│   └── utils/            # 🧐 Hàm tiện ích, helper function (format, validate, ...)
├── env                   # Thư mục chứa các đường dẫn api
│   └── type.ts           # File chứa kiểu dữ liệu của các data API
│   └── authAPI.ts        # File mẫu về một file chứa đường dẫn API
├── .env                  # Biến môi trường
├── package.json          # Thông tin dependencies
├── next.config.js        # Cấu hình Next.js
└── README.md             # 📘
```

```
Cơ chế tạo router (đường dẫn trang trong nextjs)
* Tạo thư mục sẽ tự động có router mới với tên tương ứng, nhưng phải tạo file page.tsx thì router đó mới có hiệu lực
    Ví dụ: Tạo thư mục test/page.tsx => router sẽ là /test
* Để có các layout riêng biệt (ví dụ muốn các trang auth không có sidebar và header như những phần khác) thì trong thư mục (auth) tạo thêm file layout.tsx và điều chỉnh các thành phần cần thiết (như gọi <Sidebar /> hoặc không)
* Cách gọi API để sử dụng đã có viết mẫu trong services/authService.ts
---

---

## 🔐 `app/(auth)/` – Xác thực & phân quyền

Chứa các trang liên quan đến người dùng chưa đăng nhập, ví dụ:

* `/login`
* `/register`
* `/forgot-password`

Có thể thêm logic redirect nếu đã đăng nhập.

---

## 🏠 `app/(landing)/` – Trang giới thiệu

Các trang như:

* Trang chủ công khai (landing page)
* Giới thiệu sản phẩm/dịch vụ
* Không cần đăng nhập

---

## 📄 `app/(main)/` – Nội dung chính của hệ thống

Các tính năng chính sau khi người dùng đăng nhập:

* Trang dashboard
* Trang quản lý dữ liệu
* Báo cáo, thống kê

---

## 🧐 `utils/`

Chứa các hàm tiện ích tái sử dụng:

* Format ngày, giờ
* Tính toán số liệu
* Kiểm tra định dạng

**Ví dụ:**

```ts
export function formatDate(date: Date): string {
  return date.toLocaleDateString('vi-VN');
}
```

---

## 📚 `lib/`

* Cấu hình `axios` hoặc fetch API
* Middleware xử lý lỗi
* Service liên kết backend (Flask, Node.js...)

---

## 🧱 `components/`

Chứa các UI component dùng lại:

* Button
* Card
* Modal
* Navbar
* Table

Tách riêng giao diện khỏi logic.

---

---

## 🧱 `middleeware/`

Chứa các middleware để sử dụng trong front-end 

---

## 🦡 `hooks/`

Các custom hook như:

* `useAuth()` – check đăng nhập, lấy token
* `useFetch()` – fetch API + loading/error
* `useLocalStorage()` – lưu dữ liệu vào localStorage

---

## 📝 `logs/`

* Ghi log debug, thông báo hệ thống
* Hoặc chứa xử lý toast, alert

---

---

## 📝 `env/`

* Ghi các file chứa API cho từng service
* Ghi các kiểu dữ liệu của API trong file type.ts

---

## ✅ Khởi động dự án

```bash
# Cài dependencies
npm install

# Chạy server
npm run dev
```

---