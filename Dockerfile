FROM oven/bun

WORKDIR /usr/src/app

COPY package*.json bun.lock ./
RUN bun install
COPY . .

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0

CMD [ "bun", "start" ]
