# Zoo Management System

A full-stack MERN application for managing zoo operations including animals, habitats, staff, and visitor records.

## Features

- **Authentication**: Local login/register and Google OAuth integration
- **Animal Management**: CRUD operations for animals with habitat assignments
- **Habitat Management**: Track habitat capacity and occupancy
- **Staff Management**: Role-based access control (Admin, Keeper, Veterinarian)
- **Visitor Records**: Track daily visitor statistics and revenue
- **Dashboard**: Overview statistics and metrics
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Backend
- Node.js & Express.js
- MongoDB with Mongoose ODM
- JWT Authentication
- Passport.js for Google OAuth
- bcryptjs for password hashing

### Frontend
- React 18
- React Router for navigation
- Axios for API calls
- Context API for state management

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- Google OAuth credentials (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd zoo-management-system
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Configuration**
   
   **Server (.env)**
   ```bash
   cd server
   cp .env.example .env
   ```
   
   Update `server/.env` with your values:
   ```
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=7d
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   SESSION_SECRET=your_session_secret
   CLIENT_URL=http://localhost:3000
   ```

   **Client (.env)**
   ```bash
   cd client
   ```
   
   Create `client/.env`:
   ```
   REACT_APP_API_URL=http://localhost:5000
   REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
   ```

4. **Seed the database**
   ```bash
   cd server
   npm run seed
   ```

5. **Start the application**
   ```bash
   # From root directory
   npm run dev
   ```

   This will start both the server (port 5000) and client (port 3000).

## Default Login Credentials

After seeding the database, you can use these credentials:

- **Admin**: admin@zoo.com / password123
- **Keeper**: john@zoo.com / password123
- **Veterinarian**: smith@zoo.com / password123

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/user` - Get current user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/google` - Google OAuth login

### Animals
- `GET /api/animals` - Get all animals
- `GET /api/animals/count` - Get animal count
- `POST /api/animals` - Create new animal
- `PUT /api/animals/:id` - Update animal
- `DELETE /api/animals/:id` - Delete animal

### Habitats
- `GET /api/habitats` - Get all habitats
- `GET /api/habitats/count` - Get habitat count
- `POST /api/habitats` - Create new habitat
- `PUT /api/habitats/:id` - Update habitat
- `DELETE /api/habitats/:id` - Delete habitat

### Staff
- `GET /api/staff` - Get all staff
- `GET /api/staff/count` - Get staff count
- `POST /api/staff` - Create new staff member
- `PUT /api/staff/:id` - Update staff member
- `DELETE /api/staff/:id` - Delete staff member

### Visitors
- `GET /api/visitors` - Get all visitor records
- `GET /api/visitors/recent` - Get recent visitor count
- `POST /api/visitors` - Create new visitor record
- `PUT /api/visitors/:id` - Update visitor record
- `DELETE /api/visitors/:id` - Delete visitor record

## Features Overview

### Role-Based Access Control
- **Admin**: Full access to all features
- **Keeper**: Can manage animals and habitats
- **Veterinarian**: Can manage animals and view health records

### Habitat Management
- Automatic occupancy tracking when animals are assigned
- Capacity validation to prevent overcrowding
- Staff assignment to habitats

### Animal Management
- Comprehensive animal profiles with health status
- Habitat assignment with capacity checking
- Keeper assignment for care responsibilities

### Visitor Tracking
- Daily visitor statistics
- Revenue calculation
- Historical data for analytics

## Development

### Project Structure
```
zoo-management-system/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React context providers
│   │   ├── pages/          # Page components
│   │   ├── utils/          # Utility functions
│   │   └── App.js
│   └── package.json
├── server/                 # Express backend
│   ├── config/             # Database and passport config
│   ├── middleware/         # Custom middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── scripts/            # Database seeding
│   └── index.js
└── package.json
```

### Available Scripts

**Root directory:**
- `npm run dev` - Start both client and server in development mode
- `npm run install-all` - Install dependencies for both client and server

**Server:**
- `npm start` - Start server in production mode
- `npm run dev` - Start server in development mode with nodemon
- `npm run seed` - Seed database with sample data

**Client:**
- `npm start` - Start React development server
- `npm run build` - Build for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.