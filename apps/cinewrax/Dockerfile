FROM node:18-alpine AS base


FROM base AS builder

ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

COPY package.json package-lock.json tsconfig.json ./
COPY cinewrax/package.json cinewrax/tsconfig.json ./cinewrax/
COPY cinewrax/next.config.mjs cinewrax/next-env.d.ts ./cinewrax/

RUN npm install --workspace @cinewrax/cinewrax

COPY cinewrax ./cinewrax

WORKDIR /app/cinewrax

RUN npm run build


FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/cinewrax/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/cinewrax/.next/static ./cinewrax/.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

ENV HOSTNAME="0.0.0.0"
CMD ["node", "cinewrax/server.js"]
