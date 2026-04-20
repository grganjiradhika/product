# Backend Setup Guide - Complete Professional Setup

## 📋 Project Overview

This is a production-ready backend API with:
- ✅ **Express.js** - HTTP server framework
- ✅ **MongoDB + Mongoose** - Database with ODM (Object Document Mapper)
- ✅ **Prisma** - ORM layer for schema management
- ✅ **Google OAuth 2.0** - Social login authentication
- ✅ **JWT** - Secure token-based authentication
- ✅ **CORS** - Cross-Origin Resource Sharing configuration

---

## 🚀 Quick Start

### 1. **Start Development Server**
```bash
npm run dev
```
Server runs on `http://localhost:5000`

### 2. **Setup Environment Variables**
Update `.env` file with:
- MongoDB URI
- Google OAuth credentials
- JWT secret
- Frontend URL

### 3. **Initialize Prisma**
```bash
npm run prisma:generate
```

---

## 🔧 Configuration Steps

### Step 1: Setup MongoDB

**Option A: Local MongoDB**
```
MONGODB_URI=mongodb://localhost:27017/product_db
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create account and cluster
3. Get connection string
4. Update `.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/product_db
```

### Step 2: Setup Google OAuth

1. Go to https://console.cloud.google.com/
2. Create new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - Type: Web application
   - Authorized JavaScript origins: `http://localhost:5173`
   - Authorized redirect URIs: `http://localhost:5173/`
5. Copy Client ID and Client Secret
6. Update `.env`:
```
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxx
```

### Step 3: Generate JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy output and update `.env`:
```
JWT_SECRET=<paste-here>
```

---

## 📚 API Endpoints

### Authentication Routes

#### POST `/api/auth/google`
**Authenticate with Google OAuth**

Request:
```json
{
  "token": "google_jwt_token_from_frontend"
}
```

Response (Success):
```json
{
  "message": "Authentication successful",
  "token": "your-jwt-token",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "displayName": "User Name",
    "picture": "url"
  }
}
```

---

#### GET `/api/auth/profile`
**Get Current User Profile**

Headers:
```
Authorization: Bearer <jwt_token>
```

Response:
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "displayName": "User Name",
    "picture": "url"
  }
}
```

---

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection setup
│   ├── controllers/
│   │   └── authController.js    # Google OAuth & profile logic
│   ├── middleware/
│   │   ├── corsMiddleware.js    # CORS configuration (fixes CORS error)
│   │   └── authMiddleware.js    # JWT verification
│   ├── models/
│   │   └── User.js              # Mongoose User schema
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   └── index.js             # Route aggregator
│   └── server.js                # Main Express server
├── prisma/
│   └── schema.prisma            # Prisma ORM schema
├── .env                         # Environment variables (local)
├── .env.example                 # Environment template
├── package.json                 # Dependencies
└── README.md                    # This file
```

---

## 🔐 Security Features

1. **CORS Protection**: Only requests from frontend URL allowed
2. **JWT Authentication**: Secure token-based sessions
3. **Google OAuth**: Verified tokens from Google's servers
4. **Password Hashing**: bcryptjs for password security
5. **Environment Variables**: Sensitive data never in code

---

## 📊 Database Schema (Prisma)

```prisma
model User {
  id          String    @id @default(auto()) @map("_id") @db.ObjectId
  googleId    String?   @unique
  email       String    @unique
  displayName String?
  picture     String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

---

## 💻 Frontend Integration

### .env.local (Frontend)
```
VITE_API_BASE_URL=http://localhost:5000
```

### Usage in Component
```javascript
import { authenticateWithGoogle } from './services/authService.js';

const handleGoogleCallback = async (credentialResponse) => {
  const { token: jwtToken, user } = await authenticateWithGoogle(
    credentialResponse.credential
  );
  
  // Store token and user
  localStorage.setItem('authToken', jwtToken);
  localStorage.setItem('user', JSON.stringify(user));
};
```

---

## 🐛 Troubleshooting

### CORS Error
**Problem**: Frontend cannot reach backend
**Solution**: 
- Ensure `FRONTEND_URL` in `.env` matches frontend URL (http://localhost:5173)
- Check CORS middleware is applied before routes

### MongoDB Connection Error
**Problem**: Cannot connect to database
**Solution**:
- Local: Ensure MongoDB service is running
- Atlas: Check connection string and IP whitelist

### Google OAuth Error
**Problem**: "Invalid token"
**Solution**:
- Verify `GOOGLE_CLIENT_ID` matches frontend configuration
- Token may be expired (re-authenticate)

---

## 📦 Dependencies Explained

| Package | Purpose | Interview Tip |
|---------|---------|---------------|
| express | HTTP server framework | Lightweight, widely used |
| cors | Cross-origin requests | Essential for multi-origin apps |
| mongoose | MongoDB ODM | Document validation & querying |
| @prisma/client | ORM client | Type-safe database access |
| google-auth-library | OAuth verification | Server-side token validation |
| jsonwebtoken | JWT creation/verification | Stateless authentication |
| bcryptjs | Password hashing | Security best practice |
| dotenv | Environment variables | Config management |

---

## 🎯 Interview Preparation Notes

### Key Concepts to Understand
1. **OAuth 2.0 Flow**: Authorization code flow with PKCE
2. **JWT Tokens**: Structure (Header.Payload.Signature)
3. **CORS**: How browsers enforce same-origin policy
4. **Mongoose vs Prisma**: ODM vs ORM differences
5. **Middleware**: Request/response processing pipeline
6. **Database Indexing**: Unique indexes on email & googleId

### Common Questions
- **Q: Why use both Mongoose and Prisma?**
  - A: Mongoose for runtime data validation, Prisma for type safety & migrations
  
- **Q: How does CORS work?**
  - A: Browser sends preflight OPTIONS request, server responds with allowed origins
  
- **Q: What's the difference between session & token auth?**
  - A: Session stores state on server, JWT is stateless

---

## 🚀 Production Deployment

### Before Deploying
- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT_SECRET
- [ ] Configure production MongoDB URL
- [ ] Setup HTTPS
- [ ] Enable rate limiting
- [ ] Setup error logging

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@prod-cluster.mongodb.net/product_db
JWT_SECRET=<strong-random-string>
GOOGLE_CLIENT_ID=<production-id>
GOOGLE_CLIENT_SECRET=<production-secret>
FRONTEND_URL=https://yourdomain.com
PORT=5000
```

---

## 📞 Support

For issues or questions, refer to:
- Express.js Docs: https://expressjs.com/
- Mongoose Docs: https://mongoosejs.com/
- Prisma Docs: https://www.prisma.io/docs/
- Google OAuth: https://developers.google.com/identity/
