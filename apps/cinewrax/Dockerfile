FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json tsconfig.json ./
COPY apps/cinewrax/package.json apps/cinewrax/tsconfig.json ./apps/cinewrax/
COPY apps/cinewrax/next.config.mjs apps/cinewrax/next-env.d.ts ./apps/cinewrax/

RUN npm install --prefix apps/cinewrax

COPY apps/cinewrax ./apps/cinewrax

WORKDIR /app/apps/cinewrax

RUN npm run build
