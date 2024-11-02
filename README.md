# Book Exchange Platform

## Overview
A web application that allows users to exchange and lend books. Users can register, log in, list books, search for books, and manage book transactions.

## Features
- **User Authentication**: Register, log in, log out, update profile, delete account, and reset password via email.
- **Book Listing**: Add, edit, delete, and view books.
- **Pagination and Search**: Pagination for book listings and search functionality by title, author, or genre.
- **Location-Based**: Book location defaults to the user's location if not specified.

## Prerequisites
- **Node.js** (v14 or higher)
- **MongoDB** (v4.0 or higher)
- **Git**

## Installation

### 1. Clone the Repository
```bash
git clone <repo-url>
cd book-exchange-platform
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a .env file in the root directory and add the following:
```bash
PORT=5000
MONGO_URI=your_mongo_db_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password
```

### 4. Run the Server
Development Mode (using nodemon):
```bash
cd book_exchange_platform_backend
npm run dev
```

Production Mode:
```bash
cd book_exchange_platform_backend
npm start
```

### 5. Run the Frontend
```bash
cd book_exchange_platform_frontend
npm start
```

## API Endpoints
### User Routes
- **POST /api/users:** Register a new user

- **POST /api/users/login:** Log in a user

- **POST /api/users/logout:** Log out a user

- **GET /api/users/profile:** Get user profile

- **PUT /api/users/profile:** Update user profile

- **DELETE /api/users/me:** Delete a user

- **POST /api/users/forgot-password:** Send OTP for password reset

- **POST /api/users/reset-password:** Reset password using OTP

### Book Routes
- **POST /api/books:** Add a new book

- **GET /api/books:** Get all books with pagination and search

- **GET /api/books/:id:** Get a book

- **PUT /api/books/:id:** Update a book

- **DELETE /api/books/:id:** Delete a book

- **GET /api/books/user/:userId:** Get books by user

## Usage
- Register a new user.

- Log in using your credentials.

- Update & delete the user profile.

- Add, edit, delete, and search for books.

- Manage your book listings.

## License
[MIT](https://choosealicense.com/licenses/mit/?form=MG0AV3)
