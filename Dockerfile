# Stage 1: dependencies + code copy
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: runtime
FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY src ./src
ENV PORT=3000 HOST=0.0.0.0
EXPOSE 3000
CMD ["node", "src/index.js"]
