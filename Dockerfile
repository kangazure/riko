# Stage 1 — Dependencies
FROM node:22-bullseye AS deps
WORKDIR /app
COPY package.json ./
RUN npm install --only=production --ignore-scripts

# Stage 2 — Build
FROM node:22-bullseye AS builder
WORKDIR /app
COPY package.json ./
RUN npm install --ignore-scripts
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npm run build

# Stage 3 — Production
FROM node:22-bullseye AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
