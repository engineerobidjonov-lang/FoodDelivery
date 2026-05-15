# Food Dash - Full Stack Food Delivery App

A production-ready food delivery application with a Node.js/Express backend and a Flutter mobile frontend.

## Features
- **User Authentication**: JWT-based login and registration.
- **Menu Catalog**: Browse categories and food items.
- **Cart Management**: Add/remove items and calculate totals.
- **Order System**: Place orders and track status.
- **Admin Dashboard**: Manage catalog and orders via AdminJS.
- **Clean Architecture**: Separated models, controllers, and services.
- **Deployment Ready**: Dockerized and ready for cloud deployment.

## Tech Stack
- **Frontend**: Flutter (Provider for state management)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Admin**: AdminJS
- **Authentication**: JSON Web Tokens (JWT)

## Project Structure
```text
FoodDelivery/
├── backend/                # Node.js API
│   ├── config/             # Database connection
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Auth & error handling
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API endpoints
│   ├── services/           # Business logic
│   └── utils/              # Helper functions
└── flutter/flutter_app/    # Mobile Application
    ├── lib/
    │   ├── models/         # Data models
    │   ├── providers/      # State management
    │   ├── screens/        # UI Screens
    │   ├── services/       # API interaction
    │   └── widgets/        # Reusable UI components
```

## Getting Started

### Backend Setup
1. Navigate to `backend/`
2. Run `npm install`
3. Create `.env` from `.env.example` and fill in your details.
4. Run `npm run dev` to start the development server.

### Flutter Setup
1. Navigate to `flutter/flutter_app/`
2. Run `flutter pub get`
3. Update `lib/services/api_service.dart` with your local IP if running on a physical device.
4. Run `flutter run`

## Deployment
See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.
