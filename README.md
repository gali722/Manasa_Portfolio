# Manasa Gali Portfolio

A dynamic portfolio website built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring a public portfolio and an admin content management system.

## Features

- 🎨 Dynamic content management
- 🌓 Light/Dark theme switching
- 📧 Integrated email contact form
- 🔒 Secure admin authentication
- 📱 Fully responsive design
- ⚡ Optimized performance
- ♿ Accessibility compliant

## Tech Stack

### Frontend

- React 18+ with Vite
- React Router v6
- TailwindCSS
- Framer Motion
- Axios & React Query

### Backend

- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- Nodemailer for emails
- Multer for file uploads

## Project Structure

```
manasa-portfolio/
├── client/                 # React frontend
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/                 # Express backend
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   └── server.js
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ LTS
- MongoDB Atlas account or local MongoDB instance
- Gmail account for email functionality

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd manasa-portfolio
```

2. Install dependencies for both client and server:

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. Setup environment variables:

**Client (.env):**

```bash
cd client
cp .env.example .env
# Edit .env with your configuration
```

**Server (.env):**

```bash
cd server
cp .env.example .env
# Edit .env with your configuration
```

### Running the Application

**Development Mode:**

1. Start the backend server:

```bash
cd server
npm run dev
```

2. Start the frontend (in a new terminal):

```bash
cd client
npm run dev
```

The application will be available at:

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### Building for Production

**Frontend:**

```bash
cd client
npm run build
```

**Backend:**

```bash
cd server
npm start
```

## Environment Variables

### Client Environment Variables

- `VITE_API_URL` - Backend API URL
- `VITE_SITE_URL` - Frontend URL
- `VITE_APP_NAME` - Application name

### Server Environment Variables

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key
- `EMAIL_USER` - Gmail email address
- `EMAIL_APP_PASSWORD` - Gmail app password
- `CORS_ORIGIN` - Allowed CORS origin

See `.env.example` files for complete list.

## MongoDB Configuration

The application uses MongoDB Atlas with the following configuration:

- Database: `portfolio`
- Collections will be created automatically by Mongoose

## Email Configuration

The contact form uses Gmail SMTP. To set up:

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password
3. Add the app password to `EMAIL_APP_PASSWORD` in server/.env

## Development Guidelines

- Follow ESLint and Prettier configurations
- Use conventional commit messages
- Test thoroughly before committing
- Keep dependencies up to date

## License

MIT

## Author

Manasa Gali

- Email: galimanasa3@gmail.com
- LinkedIn: [Add LinkedIn URL]
- GitHub: [Add GitHub URL]
