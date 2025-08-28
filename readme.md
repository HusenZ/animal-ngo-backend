# Animal NGO Backend API

A Node.js backend application for an Animal NGO platform that facilitates animal rescue operations and donation management. Built with Express.js, PostgreSQL, and Docker for containerized deployment.

## Features

- **User Management**: Registration, authentication, location tracking, and nearby user discovery
- **Rescue Operations**: Create, assign, and track animal rescue cases with volunteer assignment
- **Donation System**: Manage donation requests and track contributions
- **Location-based Services**: Find nearby rescue cases and users using geolocation
- **Dockerized Deployment**: Full containerization with Docker and Docker Compose

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Validation**: Joi
- **Containerization**: Docker & Docker Compose
- **Development**: Nodemon for hot reloading

## API Endpoints

### User Management

- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `POST /api/users/logout` - User logout
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile
- `PUT /api/users/location/:id` - Update user location
- `GET /api/users/nearby` - Get nearby users
- `GET /api/users` - Get all users (Admin)
- `DELETE /api/users/:id` - Delete user (Admin)

### Rescue Operations

- `POST /api/rescue` - Create rescue case
- `POST /api/rescue/nearby` - Get nearby rescue cases
- `PUT /api/rescue/:id/assign` - Assign volunteer to rescue case
- `PUT /api/rescue/:id/status` - Update rescue status

### Donation Management

- `POST /api/donations` - Create donation request
- `GET /api/donations` - Get all donations
- `GET /api/donations/:id` - Get specific donation
- `PATCH /api/donations/:id` - Update donation status
- `DELETE /api/donations/:id` - Delete donation request

## Prerequisites

- Node.js (v14 or higher)
- Docker and Docker Compose
- PostgreSQL (if running without Docker)

## Installation & Setup

### Using Docker (Recommended)

1. **Clone the repository**

```bash
git clone <repository-url>
cd animal_ngo_backend

# Database
DB_HOST=postgres
DB_PORT=5432
DB_NAME=animal_ngo_db
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

# Server
PORT=3001
NODE_ENV=production
```
