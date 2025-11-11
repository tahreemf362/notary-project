# Project-Nos Backend

Backend API for Project-Nos with authentication, role-based access control, and notarization services.

## Features

- ✅ **User Authentication**
  - Email/Password registration and login
  - JWT-based authentication
  - Email verification
  - Password reset functionality

- ✅ **Role-Based Access Control**
  - User role (default)
  - Notary role (requires verification)
  - Admin role (full access)

- ✅ **Email Service**
  - Email verification
  - Password reset emails
  - Welcome emails
  - Nodemailer integration

- ✅ **API Routes**
  - `/api/auth` - Authentication endpoints
  - `/api/admin` - Admin management
  - `/api/join` - Notary applications
  - `/api/evidence` - Document/evidence management

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Gmail account (for email service) or other SMTP provider

### Installation

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/project-nos
JWT_SECRET=your_secure_jwt_secret_key
JWT_REFRESH_SECRET=your_secure_refresh_secret_key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
EMAIL_FROM=noreply@project-nos.com
FRONTEND_URL=http://localhost:5173
```

### Running the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/signup` | Public | Register new user |
| POST | `/login` | Public | Login user |
| POST | `/logout` | Private | Logout user |
| GET | `/me` | Private | Get current user |
| GET | `/verify-email/:token` | Public | Verify email |
| POST | `/resend-verification` | Private | Resend verification email |
| POST | `/forgot-password` | Public | Request password reset |
| POST | `/reset-password/:token` | Public | Reset password |

### Admin Routes (`/api/admin`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/users` | Admin | Get all users |
| GET | `/users/:id` | Admin | Get user by ID |
| PUT | `/users/:id/role` | Admin | Update user role |
| PUT | `/users/:id/status` | Admin | Activate/deactivate user |
| PUT | `/notary/:id/verify` | Admin | Verify notary credentials |
| DELETE | `/users/:id` | Admin | Delete user |
| GET | `/stats` | Admin | Get platform statistics |

### Join Routes (`/api/join`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/notary` | Private | Apply to become notary |
| GET | `/notary/status` | Private | Get notary status |
| PUT | `/notary/credentials` | Notary | Update notary credentials |

### Evidence Routes (`/api/evidence`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/` | Private | Create new evidence |
| GET | `/` | Private | Get all evidence (filtered by role) |
| GET | `/:id` | Private | Get evidence by ID |
| PUT | `/:id` | Owner | Update evidence |
| PUT | `/:id/assign` | Notary/Admin | Assign notary |
| PUT | `/:id/notarize` | Notary | Complete notarization |
| DELETE | `/:id` | Owner/Admin | Delete evidence |

## User Roles

### User (Default)
- Create and manage own documents
- Request notarization
- View own evidence

### Notary
- All user permissions
- View pending evidence
- Assign self to evidence
- Complete notarizations
- Requires verified credentials

### Admin
- All permissions
- User management
- Role assignment
- Notary verification
- Platform statistics

## Email Configuration

### Gmail Setup

1. Enable 2-Step Verification in your Google Account
2. Generate App Password:
   - Go to Google Account > Security > 2-Step Verification
   - Scroll to "App passwords"
   - Generate password for "Mail"
3. Use generated password in `EMAIL_PASSWORD`

### Other SMTP Providers

Update these variables:
- `EMAIL_HOST` - SMTP server
- `EMAIL_PORT` - SMTP port
- `EMAIL_USER` - SMTP username
- `EMAIL_PASSWORD` - SMTP password

## Database Models

### User Model
- name, email, password
- role (user/notary/admin)
- email verification fields
- notary credentials
- timestamps

### Evidence Model
- title, description
- uploadedBy, notarizedBy
- status (pending/in-progress/notarized/rejected)
- files, recordings
- timestamps

## Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ HTTP-only cookies
- ✅ Role-based access control
- ✅ Email verification
- ✅ Input validation
- ✅ CORS protection

## Development

### Project Structure
```
backend/
├── config/
│   └── database.js
├── controllers/
│   └── authController.js
├── middleware/
│   ├── auth.js
│   └── validator.js
├── models/
│   ├── User.js
│   └── Evidence.js
├── routes/
│   ├── authRoutes.js
│   ├── adminRoutes.js
│   ├── joinRoutes.js
│   └── evidenceRoutes.js
├── services/
│   └── emailService.js
├── .env.example
├── .gitignore
├── package.json
└── server.js
```

## License

ISC
