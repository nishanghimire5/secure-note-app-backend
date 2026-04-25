# Secure Notes API

A backend REST API for managing personal notes with JWT authentication.

## Features

- User signup and login with bcrypt password hashing
- JWT-based authentication
- Full CRUD for notes with ownership checks
- Zod input validation
- MongoDB with Mongoose

## Tech stack

Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, Zod.

## Setup

1. Clone the repo
2. Run `npm install`
3. Create a `.env` file with:
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
4. Run `npm run dev`

## API endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /auth/signup | No | Register a new user |
| POST | /auth/login | No | Log in, get JWT |
| GET | /notes | Yes | List your notes |
| POST | /notes | Yes | Create a note |
| GET | /notes/:id | Yes | Get one note |
| PUT | /notes/:id | Yes | Update a note |
| DELETE | /notes/:id | Yes | Delete a note |

## Notes

Protected routes require `Authorization: Bearer <token>` header.
