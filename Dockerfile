FROM node:16-alpine AS build
ENV NODE_ENV=development

WORKDIR /app

COPY . .

RUN yarn install
RUN yarn build

FROM node:16-slim AS dist
ENV NODE_ENV=production

WORKDIR /usr/local/share/graphql-inspector

COPY --from=build /app/packages ./packages
COPY --from=build /app/package.json ./

RUN yarn install \
    && yarn cache clean

RUN ln -s /usr/local/share/graphql-inspector/packages/cli/dist/index.js /usr/local/bin/graphql-inspector \
 && chmod +x /usr/local/bin/graphql-inspector

RUN mkdir /app
WORKDIR /app
