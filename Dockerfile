# Stage 1: Build the application
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy Prisma schema and generate Prisma Client
COPY prisma ./prisma/
COPY prisma.config.ts ./
RUN npx prisma generate

# Copy the rest of the application code
COPY . .

# Build the application (Transpile TypeScript to JavaScript)
# npx tsc-alias digunakan untuk mengubah path alias menjadi relative path di file hasil build
RUN npx tsc && npx tsc-alias

# Stage 2: Production environment
FROM node:20-alpine

# Instal openssl karena diperlukan oleh Prisma engine di Alpine
RUN apk add --no-cache openssl

WORKDIR /app

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy the transpiled code from the build stage
COPY --from=build /app/dist ./dist

# Copy the custom generated Prisma Client
COPY --from=build /app/prisma/generated ./prisma/generated
COPY --from=build /app/prisma.config.ts ./prisma.config.ts

# Copy the prisma directory for potential migrations/introspection
COPY --from=build /app/prisma/schema.prisma ./prisma/schema.prisma
COPY --from=build /app/prisma/migrations ./prisma/migrations

# Expose the application port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production

# Start the application
# Menjalankan migrasi database sebelum memulai server
CMD npx prisma migrate deploy && node dist/src/main.js
