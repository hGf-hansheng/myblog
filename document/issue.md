# Issue: Docker Deployment Infinite Login Loop

## Problem Description
When deploying the blog application using Docker in a cloud environment (production mode), users experience an infinite login loop when trying to create or edit posts.
- The user logs in successfully.
- When navigating to `/new` or `/edit`, they are redirected back to `/login`.
- This works fine in the local development environment.

## Root Cause
1. **Secure Cookie Policy**: The application sets `secure: true` for cookies when `NODE_ENV=production`.
2. **Browser Restriction**: Browsers **reject** cookies marked as `Secure` if the connection is insecure (HTTP).
3. **Deployment Mismatch**: The Docker container runs in `production` mode, but if the deployment is accessed via HTTP (e.g., direct IP or non-HTTPS domain), the browser drops the authentication cookie.
4. **Middleware Logic**: The middleware checks for the cookie, finds it missing (because the browser dropped it), and redirects to login.

## Solution
Modified the authentication logic to allow insecure cookies via an environment variable, even in production mode.

### 1. Code Change (`src/lib/auth.ts`)
Updated the cookie setting logic to check for `ALLOW_INSECURE_COOKIES`.

```typescript
// Before
secure: process.env.NODE_ENV === 'production',

// After
secure: process.env.NODE_ENV === 'production' && process.env.ALLOW_INSECURE_COOKIES !== 'true',
```

### 2. Docker Configuration (`docker-compose.yml`)
Added the environment variable to explicitly allow insecure cookies in the Docker deployment.

```yaml
environment:
  - NODE_ENV=production
  - ADMIN_PASSWORD=${ADMIN_PASSWORD}
  - ALLOW_INSECURE_COOKIES=true # Added this line
```

## How to Apply
1. Pull the latest code.
2. Rebuild the containers:
   ```bash
   docker-compose down
   docker-compose up -d --build
   ```
