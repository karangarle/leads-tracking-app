# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy root package files
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

RUN npm run install:all

COPY . .

# Build backend and frontend
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

COPY backend/package*.json ./backend/
RUN cd backend && npm install --only=production

COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/frontend/dist ./frontend/dist

EXPOSE 5000

ENV PORT=5000
ENV NODE_ENV=production

CMD ["node", "backend/dist/server.js"]
