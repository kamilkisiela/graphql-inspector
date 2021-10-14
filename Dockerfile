# Take advantage of a multi-stage build to avoid dev-dependencies in the final image
FROM node:14-alpine AS builder

WORKDIR /app

COPY . .

RUN yarn
RUN yarn build

FROM node:14-alpine

WORKDIR /app

# TODO something is missing here, what do we need to copy for the command to work?
COPY --from=builder /app/packages /usr/local/share/graphql-inspector

RUN ln -s /usr/local/share/graphql-inspector/cli/dist/index.js /usr/local/bin/graphql-inspector \
 && chmod +x /usr/local/bin/graphql-inspector
