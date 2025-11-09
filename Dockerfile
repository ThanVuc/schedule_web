# ---------- 1. Build Stage ----------
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies first (cached if package.json doesn't change)
COPY package.json package-lock.json* ./
RUN npm ci

# Copy project files including .env
COPY . .

# Copy .env so Next.js can load environment variables at build time
# (Next.js automatically loads .env, .env.production, .env.local)
COPY .env .env

# Disable ESLint during build (optional)
ENV NEXT_DISABLE_ESLINT=1

# Build the Next.js project
RUN npm run build

# ---------- 2. Production Stage ----------
FROM node:22-alpine AS runner

# Set working directory
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy built Next.js app and dependencies
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
