# URL Shortener Project

This project is a comprehensive URL shortener application with a robust backend API built using Node.js, Express.js, MongoDB, and Mongoose. The backend features secure authentication, JWT token management, and comprehensive error handling.

## Features

- **User Authentication**: Secure signup and login with JWT tokens
- **Token Management**: Access and refresh token system with automatic token refresh
- **Password Security**: Bcrypt hashing with strong password validation
- **Input Validation**: Zod schema validation for all user inputs
- **Error Handling**: Centralized error handling with structured error responses
- **Cookie Management**: Secure HTTP-only cookies for token storage
- **Logging**: Comprehensive request and error logging
- **CORS Support**: Cross-origin resource sharing configuration

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod schema validation
- **Security**: Bcrypt for password hashing, Helmet for security headers
- **Development**: Nodemon for development server

## API Endpoints

- `POST /signup` - User registration
- `POST /login` - User authentication
- `POST /logout/:userId` - User logout (requires authentication)
- `DELETE /delete/:userId` - User account deletion (requires authentication)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB database
- npm or yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (create a `.env` file):
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_REFRESH_SECRET=your_refresh_token_secret
   PORT=3000
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. The server will start on the configured port (default: 3000)

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run lint` - Run ESLint for code quality
- `npm test` - Run the application

## Project Structure
