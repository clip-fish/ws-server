FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json tsconfig.json ./
RUN npm ci

COPY src ./src
RUN npm run build    # emits dist/index.js, etc.

FROM node:20-alpine AS runner
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --production

COPY --from=builder /app/dist ./dist

ENV PORT=3000 \
    HOST=0.0.0.0

EXPOSE 3000

CMD ["node", "dist/index.js"]
