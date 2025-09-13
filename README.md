# URL Shortener Project (Backend Complete)

> _Note: The backend for this URL shortener project is now fully implemented! This README describes the finished backend functionality, API, and setup instructions._

## Overview

This project is a full-featured URL shortener application. The backend is built with Node.js, Express.js, MongoDB, and Mongoose. It provides secure authentication, JWT token management, robust error handling, and a complete set of endpoints for user and URL management.

## Features

- User authentication (signup & login) with JWT tokens
- Access and refresh token system
- Password hashing with bcrypt
- Input validation using Zod schemas
- Centralized error handling
- Secure HTTP-only cookies for tokens
- Request and error logging
- CORS configuration
- Full CRUD for short URLs (create, fetch, update, delete)
- URL redirection endpoint

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod
- **Security**: Bcrypt, Helmet
- **Development**: Nodemon

## API Endpoints

### User Endpoints

- `POST /signup` — User registration
- `POST /login` — User authentication
- `POST /logout/:userId` — User logout (requires authentication)
- `DELETE /delete/:userId` — User account deletion (requires authentication)

### URL Endpoints

- `POST /url/create` — Create a new short URL (requires authentication)
- `GET /url` — Get all URLs for the authenticated user
- `GET /url?id=<urlId>` — Get a specific URL by ID (requires authentication)
- `PUT /url/update` — Update a short URL (requires authentication)
- `DELETE /url?id=<urlId>` — Delete a short URL (requires authentication)
- `GET /:alias` — Redirect to the original URL using the short alias

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:

   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_REFRESH_SECRET=your_refresh_token_secret
   PORT=3000
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. The server will run on the configured port (default: 3000)

### Available Scripts

- `npm start` — Start production server
- `npm run dev` — Start development server with nodemon
- `npm run lint` — Run ESLint
- `npm test` — Run tests

## Project Structure
