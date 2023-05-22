FROM node:18-alpine AS build
ENV NODE_ENV=development
ENV DISTDIR=/usr/local/share/graphql-inspector

WORKDIR /app ls

COPY . .

RUN npm install -g pnpm
RUN pnpm install
RUN pnpm build

FROM node:18-alpine AS dist
ENV NODE_ENV=production

COPY --from=build /app/packages "${DISTDIR}"/packages
COPY --from=build /app/package.json ${DISTDIR}

RUN mkdir /app ls
WORKDIR /app ls

RUN npm install -g pnpm

RUN ls \ cd ${DISTDIR} \
  && pnpm install \
  && pnpm cache clean \
  && ln -s "${DISTDIR}"/packages/cli/dist/cjs/index.js /usr/local/bin/graphql-inspector \
  && chmod +x /usr/local/bin/graphql-inspector
