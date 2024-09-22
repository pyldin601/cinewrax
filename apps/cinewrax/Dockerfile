FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json tsconfig.json ./
COPY cinewrax/package.json cinewrax/tsconfig.json ./cinewrax/
COPY cinewrax/next.config.mjs cinewrax/next-env.d.ts ./cinewrax/

RUN npm install --prefix cinewrax

COPY cinewrax ./cinewrax

WORKDIR /app/cinewrax

RUN npm run build
