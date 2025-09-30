# deps
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
ENV PRISMA_SKIP_POSTINSTALL=1
RUN npm ci

# build
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# run
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache openssl

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# migrate (idempotent) then start
CMD sh -c '\
  echo "[bootstrap] prisma migrate deploy"; \
  npx prisma migrate deploy --schema=./prisma/schema.prisma || true; \
  echo "[bootstrap] prisma db push (safety net)"; \
  npx prisma db push --schema=./prisma/schema.prisma; \
  echo "[bootstrap] starting Next.js"; \
  npm start \
'

EXPOSE 3000
