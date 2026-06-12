# -------- Stage 1: Build --------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# -------- Stage 2: Runtime --------
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app ./

# Remove devDependencies
RUN npm prune --omit=dev

EXPOSE 3001

ENV NODE_ENV=production

CMD ["node", "src/app.js"]