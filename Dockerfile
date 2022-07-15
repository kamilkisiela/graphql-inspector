# Take advantage of a multi-stage build to avoid dev-dependencies in the final image
FROM node:16-alpine AS builder

WORKDIR /app

COPY . .

RUN yarn
RUN yarn build

FROM node:16-alpine

WORKDIR /app

COPY --from=builder /app/packages /usr/local/share/graphql-inspector

RUN ln -s /usr/local/share/graphql-inspector/cli/dist/index.js /usr/local/bin/graphql-inspector \
 && chmod +x /usr/local/bin/graphql-inspector
