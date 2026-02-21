# SB Works — Freelancing Platform

A full-stack MERN freelancing platform with real-time features.

---

## 🚀 Quick Start

### 1. Install MongoDB
Make sure MongoDB is running on `localhost:27017` (default).
- Download from: https://www.mongodb.com/try/download/community

### 2. Setup Backend

```cmd
cd SBWorks\backend
npm install
npm run seed
npm run server
```

✅ Server starts at **http://localhost:5000**

The `seed` command creates:
- 10 project categories (Web Dev, Design, Writing, etc.)
- **Admin account**: Phone `+10000000000` · OTP `123456`

### 3. Setup Frontend

```cmd
cd SBWorks\frontend
npm install
npm run dev
```

✅ Frontend at **http://localhost:3000**

---

## 🔑 How to Login

1. Go to http://localhost:3000/auth
2. Enter a phone number (any format, e.g. `+10000000000`)
3. Click **Send OTP**
4. **Check your backend terminal** window — the OTP code prints there
5. Enter the OTP → Login!

**Admin Quick Login:**
- Phone: `+10000000000`
- OTP: `123456` (permanent test OTP)

---

## 👥 User Roles

| Role | Access |
|------|--------|
| **Admin** | Manage users, view all projects/proposals |
| **Owner (Client)** | Post projects, hire freelancers, approve work, leave reviews |
| **Freelancer** | Browse projects, submit proposals, submit work |

**Registration Flow:**
1. Enter phone → Get OTP → Verify
2. Complete profile (name, email, pick role)
3. Admin can approve/reject users via Admin Panel

> **Note:** By default, users need admin approval. For testing, the admin can approve users at http://localhost:3000/admin/users

---

## 📡 API Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/user/get-otp | Send OTP |
| POST | /api/user/check-otp | Verify OTP & Login |
| POST | /api/user/complete-profile | Complete registration |
| GET | /api/project/list | Browse projects |
| POST | /api/project/add | Create project (Owner) |
| POST | /api/proposal/add | Submit proposal (Freelancer) |
| PATCH | /api/proposal/:id | Accept/Reject proposal (Owner) |
| POST | /api/submission/submit | Submit work (Freelancer) |
| PATCH | /api/submission/review/:id | Approve/request revision (Owner) |
| POST | /api/message/send | Send message |
| POST | /api/review/add | Leave review |
| GET | /api/notification | Get notifications |
| GET | /api/admin/user/list | List all users (Admin) |
| PATCH | /api/admin/user/verify/:id | Change user status (Admin) |

---

## ⚙️ Environment Variables (backend/.env)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/sbworks
ACCESS_TOKEN_SECRET_KEY=sbworks_access_secret_key_2024_secure
REFRESH_TOKEN_SECRET_KEY=sbworks_refresh_secret_key_2024_secure
COOKIE_PARSER_SECRET_KEY=sbworks_cookie_secret_key_2024
NODE_ENV=development
DOMAIN=localhost

# Twilio SMS (OPTIONAL — leave blank for dev)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_phone
```

---

## 🛠️ Tech Stack

**Frontend:** React 18 · Bootstrap 5 · Material UI · Axios · Socket.io-client  
**Backend:** Express.js · MongoDB · Mongoose · Socket.io · JWT · Multer  
**Real-time:** Socket.io for chat and notifications
