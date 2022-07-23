FROM node:16-alpine AS builder
ENV NODE_ENV=development

WORKDIR /app

COPY . .

RUN yarn
RUN yarn build

FROM node:16-slim AS dist
ENV NODE_ENV=production

WORKDIR /usr/local/share/graphql-inspector

COPY --from=builder /app/packages ./packages
COPY --from=builder /app/package.json ./package.json

RUN yarn

RUN ln -s /usr/local/share/graphql-inspector/packages/cli/dist/index.js /usr/local/bin/graphql-inspector \
 && chmod +x /usr/local/bin/graphql-inspector

RUN mkdir /app
WORKDIR /app
