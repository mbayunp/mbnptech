# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

# Disables telemetry during the build
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Stage 2: Production Run
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/public ./public

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["npm", "run", "start"]
