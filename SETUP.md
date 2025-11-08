# Quick Setup Guide

## Initial Setup Steps

### 1. Install Dependencies

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### 2. Configure Environment Variables

**Client Configuration:**

```bash
cd client
cp .env.example .env
```

Edit `client/.env` if needed (defaults should work for local development).

**Server Configuration:**

```bash
cd server
cp .env.example .env
```

Edit `server/.env` and update:

- `JWT_SECRET` - Generate a strong random secret
- `JWT_REFRESH_SECRET` - Generate another strong random secret
- `ENCRYPTION_KEY` - Generate a 32-byte hex key
- Other variables are pre-configured for development

### 3. Generate Secure Keys

You can generate secure keys using Node.js:

```bash
# Generate JWT secrets (run in terminal)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate encryption key (32 bytes)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Start Development Servers

**Terminal 1 - Backend:**

```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**

```bash
cd client
npm run dev
```

### 5. Verify Setup

- Frontend: http://localhost:5173
- Backend Health Check: http://localhost:5000/api/health

## MongoDB Connection

The project is configured to use MongoDB Atlas with the credentials provided in the design document. The connection string is already set in `server/.env.example`.

## Email Configuration

The Gmail credentials are pre-configured in `server/.env.example`. The app password is already set up for development.

## Next Steps

After completing the setup:

1. Verify both servers are running
2. Check the health endpoint returns success
3. Proceed to implement the next task in the implementation plan

## Troubleshooting

**MongoDB Connection Issues:**

- Verify your IP is whitelisted in MongoDB Atlas
- Check the connection string is correct
- Ensure network connectivity

**Port Already in Use:**

- Change PORT in server/.env
- Change port in client/vite.config.js

**Module Not Found:**

- Run `npm install` in both client and server directories
- Clear node_modules and reinstall if needed
