FROM node:18-alpine AS base


FROM base AS builder

WORKDIR /app

COPY package.json package-lock.json tsconfig.json ./
COPY shared/package.json shared/tsconfig.json ./shared/
COPY pubsub/package.json pubsub/tsconfig.json ./pubsub/

RUN npm install --workspace @cinewrax/shared
RUN npm install --workspace @cinewrax/pubsub

COPY shared ./shared
COPY pubsub ./pubsub

WORKDIR /app/shared

RUN npm run build

WORKDIR /app/pubsub

RUN npm run build

WORKDIR /app

RUN npm prune --omit=dev


FROM base AS runner

WORKDIR /app

COPY package.json package-lock.json ./
COPY node_modules ./node_modules

WORKDIR /app/shared

COPY --from=builder /app/shared/package.json ./
COPY --from=builder /app/shared/lib ./lib

WORKDIR /app/pubsub

COPY --from=builder /app/pubsub/package.json ./
COPY --from=builder /app/pubsub/dist ./dist

EXPOSE 8080

CMD ["node", "dist/src/index.js"]
