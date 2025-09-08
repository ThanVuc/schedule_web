# ---------- 1. Build Stage ----------
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies first (cached if package.json doesn't change)
COPY package.json package-lock.json* ./
RUN npm ci

# Copy project files
COPY . .

# Disable ESLint during build
ENV NEXT_DISABLE_ESLINT=1
ARG NEXT_PUBLIC_API_URL_BASE
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID

ENV NEXT_PUBLIC_API_URL_BASE=$NEXT_PUBLIC_API_URL_BASE
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID

# Build the Next.js project
RUN npm run build

# ---------- 2. Production Stage ----------
FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "start"]
