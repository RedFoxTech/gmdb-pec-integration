# Builder
FROM node:22-alpine AS builder

WORKDIR /app

ARG APP_ENV
ENV APP_ENV=${APP_ENV}

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build



# Runner
FROM node:22-alpine AS runner

WORKDIR /app

ARG APP_ENV
ENV APP_ENV=${APP_ENV}

COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/node_modules ./node_modules
RUN yarn install --production --ignore-scripts

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./

EXPOSE 3000

CMD ["yarn", "start"]
