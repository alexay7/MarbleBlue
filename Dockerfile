FROM oven/bun:latest
WORKDIR /usr/src/app

COPY package*.json ./
COPY bun.lock ./

RUN bun install --frozen-lockfile

COPY . .

RUN chown -R bun:bun /usr/src/app
USER bun

ENV NODE_ENV=production
CMD ["bun", "run", "start"]