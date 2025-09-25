# # Stage 1: Build frontend
# FROM node:18 AS frontend-builder
# WORKDIR /app/introdemo
# COPY introdemo/package*.json ./
# RUN npm install
# COPY introdemo/ .
# RUN npm run build

# # Stage 2: Build backend
# FROM node:18 AS backend-builder
# WORKDIR /app/backend
# COPY backend/package*.json ./
# RUN npm install
# COPY backend/ .

# # Stage 3: Combine backend + frontend
# FROM node:18
# WORKDIR /app

# # Copy backend code + frontend build
# COPY --from=backend-builder /app/backend ./backend
# COPY --from=frontend-builder /app/introdemo/dist ./backend/public

# WORKDIR /app/backend

# ENV PORT=3000
# EXPOSE 3000

# CMD ["node", "index.js"]


FROM node:18 AS frontend-builder
WORKDIR /app/introdemo
COPY introdemo/package*.json ./
RUN npm install
COPY introdemo ./
RUN npm run build

FROM node:18 AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend ./
# RUN npm run dev

FROM node:18
WORKDIR /app

COPY --from=backend-builder /app/backend ./backend
COPY --from=frontend-builder /app/introdemo/dist ./backend/public

WORKDIR /app/backend

ENV PORT=3000
EXPOSE 3000

CMD ["node", "index.js"]
