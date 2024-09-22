FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json tsconfig.json ./
COPY cinewrax/package.json cinewrax/tsconfig.json ./cinewrax/
COPY cinewrax/next.config.mjs cinewrax/next-env.d.ts ./cinewrax/

RUN npm install --workspace @cinewrax/cinewrax

COPY cinewrax ./cinewrax

WORKDIR /app/cinewrax

RUN NEXT_TELEMETRY_DISABLED=1 npm run build

FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=builder /app/cinewrax/.next ./cinewrax/
#COPY --from=builder /app/cinewrax/public ./cinewrax/
COPY --from=builder /app/cinewrax/package.json ./cinewrax/
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "start", "--workspace", "@cinewrax/cinewrax"]
