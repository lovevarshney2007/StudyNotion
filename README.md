# StudyNotion — Ed-Tech Platform

A fully functional ed-tech platform built with the **MERN stack** (MongoDB, Express.js, React, Node.js).

---

## 🚀 Features

- **Students**: Browse courses, enroll via Razorpay, track progress, write reviews, download completion certificates
- **Instructors**: Create/edit/delete courses with sections & videos, view dashboard analytics and detailed insights
- **Admin**: Platform-wide stats, manage users, instructors, and courses
- **Auth**: JWT-based auth with OTP email verification, forgot/reset password
- **Media**: Cloudinary integration for thumbnails and video uploads

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Redux Toolkit, Tailwind CSS, Vite |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT + Bcrypt |
| Payments | Razorpay |
| Media | Cloudinary |
| Email | Nodemailer |
| Testing | Node built-in test runner (backend), Vitest (frontend) |

---

## 📁 Project Structure

```
StudyNotion/
├── server/              # Node.js + Express backend
│   ├── controllers/     # Route handlers
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routers
│   ├── middlewares/     # JWT auth middleware
│   ├── utils/           # Cloudinary, mail, duration helpers
│   ├── mail/templates/  # Email HTML templates
│   ├── config/          # DB, Cloudinary, Razorpay config
│   └── tests/           # Backend integration tests
└── frontend/            # React + Vite frontend
    └── src/
        ├── pages/       # Route-level pages
        ├── component/   # Reusable components
        ├── services/    # API service functions
        ├── slices/      # Redux state slices
        └── tests/       # Frontend unit tests
```

---

## ⚙️ Environment Variables

### Backend — `server/.env`

```env
PORT=4000
MONGODB_URL=mongodb+srv://<user>:<password>@cluster.mongodb.net/studynotion
JWT_SECRET=your_jwt_secret_here

# Cloudinary
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
FOLDER_NAME=StudyNotion

# Nodemailer (Gmail)
MAIL_HOST=smtp.gmail.com
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_gmail_app_password

# Razorpay
RAZORPAY_KEY=rzp_test_xxxxxxxxxxxx
RAZORPAY_SECRET=your_razorpay_secret
```

### Frontend — `frontend/.env`

```env
VITE_APP_BASE_URL=http://localhost:4000
VITE_RAZORPAY_KEY=rzp_test_xxxxxxxxxxxx
```

---

## 🛠️ Local Development

### Prerequisites
- Node.js >= 18
- MongoDB Atlas account
- Cloudinary account
- Razorpay test account

### 1. Clone & Install

```bash
git clone https://github.com/youruser/StudyNotion.git

# Backend
cd StudyNotion/server
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Set up environment files
Copy the env templates above into `server/.env` and `frontend/.env`.

### 3. Run the servers

```bash
# In /server
npm run dev        # Starts on http://localhost:4000

# In /frontend
npm run dev        # Starts on http://localhost:5173
```

---

## 🧪 Testing

### Backend

```bash
cd server
npm test
# Uses Node.js built-in test runner — no extra dependencies needed
# Set TEST_BASE_URL=http://localhost:4000 if needed
```

### Frontend

```bash
cd frontend
npm test          # Run all tests once
npm run test:watch  # Watch mode
```

---

## 🌐 API Reference

Base URL: `http://localhost:4000/api/v1`

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/signup` | Register a new user |
| POST | `/auth/login` | Login & get JWT |
| POST | `/auth/verifyOTP` | Verify email OTP |
| POST | `/auth/reset-password-token` | Send forgot-password email |
| POST | `/auth/reset-password` | Reset password with token |

### Courses
| Method | Endpoint | Description |
|---|---|---|
| GET | `/course/getAllCourses` | Get all published courses |
| POST | `/course/getCourseDetails` | Get single course details |
| POST | `/course/createCourse` | Create course (Instructor) |
| POST | `/course/editCourse` | Edit course (Instructor) |
| DELETE | `/course/deleteCourse` | Delete course (Instructor) |
| POST | `/course/createRating` | Rate a course (Student) |

### Payments
| Method | Endpoint | Description |
|---|---|---|
| POST | `/payment/capturePayment` | Initiate Razorpay order |
| POST | `/payment/verifyPayment` | Verify & enroll student |
| POST | `/payment/sendPaymentSuccessEmail` | Send confirmation email |

### Admin
| Method | Endpoint | Description |
|---|---|---|
| GET | `/admin/stats` | Platform-wide statistics |
| GET | `/admin/users` | All registered users |
| GET | `/admin/instructors` | All instructors |
| GET | `/admin/courses` | All courses |
| PATCH | `/admin/user/:id/toggle-status` | Activate/Deactivate user |
| DELETE | `/admin/course/:id` | Delete any course |

---

## 🚀 Deployment

| Service | Platform |
|---|---|
| Frontend | [Vercel](https://vercel.com) |
| Backend | [Render](https://render.com) or [Railway](https://railway.app) |
| Database | [MongoDB Atlas](https://cloud.mongodb.com) |
| Media | [Cloudinary](https://cloudinary.com) |

### Vercel (Frontend)
1. Import the repo on Vercel
2. Set **Root Directory** to `frontend`
3. Add all `VITE_*` env vars in Vercel dashboard

### Render (Backend)
1. Create a new **Web Service**
2. Set **Root Directory** to `server`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add all backend env vars

---

## 📋 Future Enhancements

1. **Admin Panel** — currently built as read-only stats + user/course management. A future iteration can add instructor approval workflows.
2. **Live Classes** — integrate WebRTC or Zoom SDK
3. **AI Recommendations** — personalized course suggestions based on learning history
4. **Discussion Forums** — per-course Q&A threads
5. **Mobile App** — React Native companion app
