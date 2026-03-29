# ShopEase — Backend API

> Node.js + Express + MongoDB REST API powering the ShopEase eCommerce platform.

---

## 🚀 Quick Start

```bash
cd backend
npm install
npm run dev          # starts with nodemon on port 5001
```

---

## 🔑 Test Credentials

| Role  | Email                  | Password   |
|-------|------------------------|------------|
| Admin | admin@shopease.com     | admin123   |
| User  | user@test.com          | user123    |

> Run `node seed.js` to populate the database with 63 products across 8 categories.

---

## ⚙️ Environment Variables (`.env`)

```env
# Server
PORT=5001

# MongoDB Atlas
MONGODB_URI=mongodb+srv://dheerajmlk123:Mongodb@cluster0.phlkctp.mongodb.net/ecommerce

# JWT
JWT_SECRET=shopease_jwt_secret_key_2024

# Cloudinary (image upload)
CLOUDINARY_CLOUD_NAME=dnclehvkq
CLOUDINARY_API_KEY=178899632696332
CLOUDINARY_API_SECRET=p-aXN2Vp29EUVGvEjxkq8vMeYKs

# Razorpay (payments — test mode)
RAZORPAY_KEY_ID=rzp_test_SGgUxNXJPhFnL7
RAZORPAY_KEY_SECRET=gOf4SoUh0IiNkCRlzgXWlx4c

# Forgot Password Email (Gmail)
FRONTEND_URL=http://localhost:5173
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

### 📧 Setting Up Gmail for Forgot Password

1. Go to [myaccount.google.com](https://myaccount.google.com) → **Security**
2. Enable **2-Step Verification**
3. Go to **App Passwords** → Select app: Mail, device: Other → Generate
4. Copy the 16-character password into `EMAIL_PASS`

> Without `EMAIL_USER`/`EMAIL_PASS`, the API runs in **dev mode** — the reset link is returned directly in the API response.

---

## 🗂️ Project Structure

```
backend/
├── config/
│   ├── db.js            # MongoDB connection
│   ├── cloudinary.js    # Cloudinary setup
│   ├── razorpay.js      # Razorpay instance
│   └── mailer.js        # Nodemailer + HTML email template
├── middleware/
│   └── auth.js          # JWT auth middleware
├── models/
│   ├── User.js          # User schema (with reset token fields)
│   ├── Product.js       # Product schema
│   ├── Cart.js          # Cart schema
│   ├── Order.js         # Order schema
│   └── Wishlist.js      # Wishlist schema
├── routes/
│   ├── auth.js          # Register, Login, Forgot/Reset Password
│   ├── products.js      # Products CRUD + deals + category-blocks
│   ├── cart.js          # Cart operations
│   ├── wishlist.js      # Wishlist toggle
│   ├── orders.js        # Orders + return requests
│   ├── payment.js       # Razorpay create-order + verify
│   └── admin.js         # Admin-only routes
├── seed.js              # Database seeder (63 products)
├── server.js            # Express app entry point
└── .env                 # Environment variables
```

---

## 📡 API Reference

### Auth — `/api/auth`

| Method | Endpoint                        | Auth   | Description                         |
|--------|---------------------------------|--------|-------------------------------------|
| POST   | `/register`                     | ❌     | Create new user account             |
| POST   | `/login`                        | ❌     | Login, returns JWT token            |
| GET    | `/me`                           | ✅     | Get current logged-in user          |
| PUT    | `/profile`                      | ✅     | Update name, phone, address         |
| POST   | `/forgot-password`              | ❌     | Send password reset link to email   |
| GET    | `/verify-reset-token/:token`    | ❌     | Check if reset token is valid       |
| POST   | `/reset-password/:token`        | ❌     | Set new password using token        |

### Products — `/api/products`

| Method | Endpoint              | Auth   | Description                                 |
|--------|-----------------------|--------|---------------------------------------------|
| GET    | `/`                   | ❌     | List all products (search, filter, sort, paginate) |
| GET    | `/featured`           | ❌     | Get featured products                       |
| GET    | `/bestsellers`        | ❌     | Get best-seller products                    |
| GET    | `/deals`              | ❌     | Get deals by discount range (`?minDiscount=60`) |
| GET    | `/category-blocks`    | ❌     | Products grouped by category (4 per category) |
| GET    | `/categories`         | ❌     | List all unique categories                  |
| GET    | `/:id`                | ❌     | Get single product by ID                    |

**Query params for `GET /`:** `search`, `category`, `sort` (`price_asc`, `price_desc`, `rating`, `discount`, `name`), `page`, `limit`

### Cart — `/api/cart`

| Method | Endpoint              | Auth | Description           |
|--------|-----------------------|------|-----------------------|
| GET    | `/`                   | ✅   | Get user's cart       |
| POST   | `/add`                | ✅   | Add item to cart      |
| PUT    | `/update`             | ✅   | Update item quantity  |
| DELETE | `/remove/:productId`  | ✅   | Remove item from cart |
| DELETE | `/clear`              | ✅   | Clear entire cart     |

### Orders — `/api/orders`

| Method | Endpoint          | Auth | Description                          |
|--------|-------------------|------|--------------------------------------|
| GET    | `/`               | ✅   | Get all user orders                  |
| POST   | `/`               | ✅   | Create order (from cart)             |
| GET    | `/:id`            | ✅   | Get single order                     |
| PUT    | `/:id/return`     | ✅   | Request return for delivered order   |

### Payment — `/api/payment`

| Method | Endpoint         | Auth | Description                         |
|--------|------------------|------|-------------------------------------|
| POST   | `/create-order`  | ✅   | Create Razorpay order               |
| POST   | `/verify`        | ✅   | Verify Razorpay payment signature   |

### Admin — `/api/admin` *(admin role required)*

| Method | Endpoint               | Description                          |
|--------|------------------------|--------------------------------------|
| GET    | `/stats`               | Dashboard stats (users, orders, revenue) |
| GET    | `/products`            | All products                         |
| POST   | `/products`            | Create product (Cloudinary upload)   |
| PUT    | `/products/:id`        | Update product                       |
| DELETE | `/products/:id`        | Delete product                       |
| GET    | `/orders`              | All orders (all users)               |
| PUT    | `/orders/:id/status`   | Update order status                  |
| GET    | `/users`               | All registered users                 |
| DELETE | `/users/:id`           | Delete user                          |

---

## 🛠️ Tech Stack

| Technology       | Version  | Purpose                         |
|------------------|----------|---------------------------------|
| Node.js          | 18+      | Runtime                         |
| Express          | 4.18     | Web framework                   |
| MongoDB Atlas    | —        | Database (cloud)                |
| Mongoose         | 7.6      | ODM                             |
| bcryptjs         | 2.4      | Password hashing                |
| jsonwebtoken     | 9.0      | JWT authentication              |
| nodemailer       | 6.x      | Email (forgot password)         |
| Cloudinary       | 1.41     | Image storage                   |
| multer           | 1.4      | Multipart form (image upload)   |
| Razorpay         | 2.9      | Payment gateway                 |
| dotenv           | 16.3     | Environment variables           |
| nodemon          | 3.0      | Dev auto-restart                |

---

## 📦 Database Seed

```bash
node seed.js
```

Seeds **63 products** across 8 categories:

| Category      | Count | Discount Range |
|---------------|-------|----------------|
| Electronics   | 12    | 35% – 73%      |
| Mobiles       | 6     | 37% – 70%      |
| Fashion       | 8     | 63% – 71%      |
| Footwear      | 7     | 56% – 67%      |
| Home & Kitchen| 8     | 58% – 70%      |
| Accessories   | 7     | 65% – 72%      |
| Sports        | 8     | 57% – 68%      |
| Books         | 7     | 40% – 50%      |

---

## 🔐 Security Notes

- Passwords are hashed with **bcryptjs** (10 salt rounds)
- JWTs expire in **7 days**
- Reset tokens expire in **15 minutes** and are hashed (SHA-256) before DB storage
- Admin routes protected by role-based middleware
- CORS enabled for local development

---

*© 2024 ShopEase*
