# Deployment Guide

This guide provides step-by-step instructions for deploying the Food Dash backend to production (e.g., Render, Railway, or DigitalOcean) and preparing the Flutter app.

## 1. Backend Deployment (Render/Railway)

### Prerequisites
- GitHub account
- MongoDB Atlas account (for production database)
- Render or Railway account

### Step 1: Push to GitHub
If you haven't already, initialize a git repo and push your code:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

### Step 2: Set up MongoDB Atlas
1. Create a free cluster on MongoDB Atlas.
2. Create a database user and whitelist all IP addresses (`0.0.0.0/0`) for simplicity (or use your deployment platform's IPs).
3. Copy the Connection String.

### Step 3: Deploy on Render
1. Create a **New Web Service**.
2. Connect your GitHub repository.
3. Set the **Build Command**: `npm install` (in the `backend` directory).
4. Set the **Start Command**: `npm start`.
5. Add Environment Variables:
   - `PORT`: `5000`
   - `MONGO_URI`: (Your MongoDB Atlas string)
   - `JWT_SECRET`: (A long random string)
   - `NODE_ENV`: `production`

### Step 4: Docker Deployment (Optional)
If you prefer Docker:
1. Render and Railway both support `Dockerfile`.
2. Ensure the `Dockerfile` is in the `backend/` directory.
3. The platform will automatically detect and build it.

## 2. Flutter Preparation

### Step 1: Update API URL
In `lib/services/api_service.dart`, update the `baseUrl` to your production URL:
```dart
static String get baseUrl => 'https://your-backend-url.onrender.com/api';
```

### Step 2: Build for Production
#### Android
```bash
flutter build apk --release
```
#### iOS
```bash
flutter build ios --release
```

## 3. Environment Variables Setup Guide

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | The port the server runs on | 5000 |
| MONGO_URI | MongoDB Connection String | mongodb+srv://... |
| JWT_SECRET | Secret key for JWT signing | MySuperSecretKey123 |
| ADMIN_EMAIL | Default admin user email | admin@example.com |
| ADMIN_PASSWORD | Default admin user password | securepassword |

## 4. Testing Instructions

### Manual API Testing
Use Postman or Insomnia:
1. **Register**: `POST /api/auth/register`
2. **Login**: `POST /api/auth/login` -> Copy the `token`.
3. **Get Foods**: `GET /api/foods`
4. **Create Order**: `POST /api/orders/create` (Include `Authorization: Bearer <token>` header).

### Flutter Testing
1. Run `flutter test` for unit tests.
2. Run the app on an emulator and perform the login -> add to cart -> checkout flow.
