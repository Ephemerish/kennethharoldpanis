FROM node:lts AS runtime
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000
CMD ["node", "./dist/server/entry.mjs"]
