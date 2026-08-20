# 🎓 StudyNotion — Full-Stack Ed-Tech Learning Platform

[![React](https://img.shields.io/badge/Frontend-React_19-blue?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Bundler-Vite-646CFF?logo=vite)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Server-Express.js-000000?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB_Atlas-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Redux Toolkit](https://img.shields.io/badge/State-Redux_Toolkit-764ABC?logo=redux)](https://redux-toolkit.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

**StudyNotion** is a production-ready, full-stack educational technology (Ed-Tech) platform built using the MERN stack. It empowers students to discover, purchase, and consume structured video courses, provides instructors with intuitive course creation and analytics tools, and equips administrators with comprehensive platform governance capabilities.

---

## ✨ Key Features

### 👨‍🎓 Student Experience
* **Course Catalog & Search**: Dynamic course browsing filtered by category, rating, price, and search queries.
* **Course Details & Syllabus**: In-depth course view featuring what you'll learn, expandable curriculum accordions, instructor biographies, and student reviews.
* **Seamless Checkout**: Shopping cart management with Razorpay test-mode integration and instant email receipts.
* **Interactive Video Player**: Custom lecture viewer with play/pause, seek, previous/next lecture navigation, and automatic progress tracking.
* **Course Completion & Certificates**: Real-time progress bar calculation and certificate generation upon 100% completion.
* **Rating & Reviews**: Submit ratings and detailed feedback for completed courses.

### 👨‍🏫 Instructor Portal
* **Course Builder Suite**: 3-step structured course creator (Basic Information -> Section/Lecture Builder -> Publishing Settings).
* **Multimedia Uploads**: Direct Cloudinary integration for course thumbnails and video lectures.
* **Curriculum Management**: Add, edit, reorder, and delete sections and video subsections in real time.
* **Instructor Analytics**: Visual charts for revenue trends, enrolled students per course, and overall earnings.
* **Course Lifecycle**: Switch courses between Draft and Published states, or delete courses with automated cleanup.

### 🛡️ Admin Dashboard
* **Platform Overview**: Real-time stats on total students, instructors, published courses, and total platform revenue.
* **User & Instructor Management**: View registered users with one-click account activation/deactivation controls.
* **Course Governance**: Platform-wide course inspection and moderation tools.

### 🔐 Security & Authentication
* **JWT Authentication**: Role-based access control (Student, Instructor, Admin) with secure cookie & header token delivery.
* **Email OTP Verification**: Secure signup flow with one-time passwords powered by Nodemailer.
* **Password Reset Workflow**: Time-limited cryptographic password reset links sent via email.

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, Redux Toolkit, React Router v6, Tailwind CSS |
| **Backend** | Node.js, Express.js, REST API |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Authentication** | JSON Web Tokens (JWT), Bcrypt.js |
| **Payments** | Razorpay Payment Gateway (Test Mode) |
| **Media & Storage** | Cloudinary (Thumbnails & Video Lectures) |
| **Email Service** | Nodemailer (Gmail SMTP) |
| **Testing** | Node.js Test Runner (Backend), Vitest (Frontend) |

---

## 📁 Repository Structure

```
StudyNotion/
├── server/                      # Express backend application
│   ├── config/                  # DB, Cloudinary, and Razorpay configurations
│   ├── controllers/             # Core controller logic (Auth, Course, Payment, Profile, etc.)
│   ├── mail/templates/          # Responsive HTML email templates
│   ├── middlewares/             # JWT verification & role authorization middlewares
│   ├── models/                  # Mongoose schemas (User, Course, Category, Section, etc.)
│   ├── routes/                  # Express route declarations
│   ├── scripts/                 # Database seed scripts
│   ├── tests/                   # Backend integration & API test suites
│   ├── utils/                   # Cloudinary uploader, duration helpers, mailer
│   └── index.js                 # Server entrypoint
│
└── frontend/                    # React frontend application
    └── src/
        ├── Asset/               # Logos, banners, illustrations, and media assets
        ├── component/
        │   ├── common/          # Reusable UI components (Navbar, Footer, Modals, Buttons)
        │   └── core/            # Feature components (Catalog, Dashboard, Course, ViewCourse)
        ├── data/                # Static navigation and footer link definitions
        ├── pages/               # Top-level route pages (Home, Catalog, Dashboard, ViewCourse)
        ├── reducer/             # Redux combined root reducer
        ├── services/            # API connectors and endpoint handlers
        ├── slices/              # Redux state slices (auth, cart, course, profile, viewCourse)
        ├── tests/               # Vitest unit test suites
        └── utils/               # Constants, date formatters, rating calculators
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** `>= 18.0.0`
* **npm** `>= 9.0.0`
* **MongoDB Atlas** database URI
* **Cloudinary** account credentials
* **Razorpay** test account credentials

---

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/your-username/StudyNotion.git
cd StudyNotion

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

### 2. Configure Environment Variables

#### Backend (`server/.env`):
Create a `.env` file in the `server/` directory:
```env
PORT=4000
MONGODB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/studynotion
JWT_SECRET=your_super_secret_jwt_key
FRONTEND_URL=http://localhost:5173

# Cloudinary
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
FOLDER_NAME=StudyNotion

# Nodemailer / Gmail SMTP
MAIL_HOST=smtp.gmail.com
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_gmail_app_password

# Razorpay (Test Mode)
RAZORPAY_KEY=rzp_test_xxxxxxxxxxxx
RAZORPAY_SECRET=your_razorpay_secret
```

#### Frontend (`frontend/.env`):
Create a `.env` file in the `frontend/` directory:
```env
VITE_APP_BASE_URL=http://localhost:4000/api/v1
VITE_APP_RAZORPAY_KEY=rzp_test_xxxxxxxxxxxx
```

---

### 3. Seed Sample Courses (Optional but Recommended)

Populate your database with sample categories, an instructor account, and published courses with video lectures:

```bash
cd server
node scripts/seedCourses.js
```

**Default Seeded Accounts**:
* **Instructor**: `instructor@studynotion.com` / `Instructor@123`

---

### 4. Run Locally

Open two terminal windows:

#### Terminal 1 — Backend:
```bash
cd server
npm run dev
# Server runs on http://localhost:4000
```

#### Terminal 2 — Frontend:
```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

---

## 🧪 Testing & Validation

### Backend Integration Tests:
```bash
cd server
npm test
```
*Uses Node.js built-in test runner to test auth, course queries, token security, and validation.*

### Frontend Unit Tests:
```bash
cd frontend
npm test
```
*Runs Vitest test suite covering average ratings, date formatters, and utility functions.*

### Production Build Validation:
```bash
cd frontend
npm run build
```

---

## 🌐 API Endpoints Reference

Base URL: `http://localhost:4000/api/v1`

### Authentication (`/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/auth/send-otp` | Generate and dispatch OTP email | No |
| POST | `/auth/signup` | Register a new student or instructor | No |
| POST | `/auth/login` | Authenticate user & return JWT | No |
| POST | `/auth/reset-password-token` | Send password reset link | No |
| POST | `/auth/reset-password` | Update password via token | No |

### Courses & Curriculum (`/course`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/course/getAllCourses` | Fetch all published courses | No |
| POST | `/course/getCourseDetails` | Fetch full details for a course | No |
| POST | `/course/getFullCourseDetails` | Fetch course details with completed lectures | Yes (Student/Instructor) |
| POST | `/course/createCourse` | Create a new course | Yes (Instructor) |
| POST | `/course/editCourse` | Update course details | Yes (Instructor) |
| DELETE | `/course/deleteCourse` | Cascade delete a course | Yes (Instructor) |
| POST | `/course/addSection` | Add a section to course | Yes (Instructor) |
| POST | `/course/addSubSection` | Upload lecture video to section | Yes (Instructor) |
| POST | `/course/updateCourseProgress`| Mark a lecture as completed | Yes (Student) |
| POST | `/course/createRating` | Submit rating and review | Yes (Student) |

### Payments (`/payment`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/payment/capturePayment` | Create Razorpay order | Yes (Student) |
| POST | `/payment/verifyPayment` | Verify HMAC & enroll student | Yes (Student) |
| POST | `/payment/sendPaymentSuccessEmail` | Dispatch confirmation email | Yes (Student) |

### Admin (`/admin`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/admin/stats` | Retrieve platform-wide metrics | Yes (Admin) |
| GET | `/admin/users` | List all registered users | Yes (Admin) |
| GET | `/admin/instructors` | List all instructors & their courses | Yes (Admin) |
| GET | `/admin/courses` | List all courses | Yes (Admin) |
| PATCH | `/admin/user/:id/toggle-status` | Toggle user active/inactive state | Yes (Admin) |
| DELETE | `/admin/course/:id` | Admin course deletion | Yes (Admin) |

---

## 🚢 Deployment Guide

* **Frontend**: Deploy on [Vercel](https://vercel.com) by pointing to `frontend/` with `npm run build` as the build command.
* **Backend**: Deploy on [Render](https://render.com) or [Railway](https://railway.app) pointing to `server/` with `npm start` as the start command.
* **Database**: Hosted on [MongoDB Atlas](https://www.mongodb.com/atlas).

---

## 📄 License
This project is licensed under the MIT License — see the LICENSE file for details.
