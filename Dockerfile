FROM node:18-alpine AS build
ENV NODE_ENV=development

WORKDIR /app

COPY . .

RUN npm install -g pnpm
RUN pnpm install
RUN pnpm build

FROM node:18-alpine AS dist
ENV NODE_ENV=production
ENV DISTDIR=/usr/local/share/graphql-inspector

COPY --from=build /app/packages "${DISTDIR}"/packages
COPY --from=build /app/package.json ${DISTDIR}

RUN mkdir /app
WORKDIR /app

RUN npm install -g pnpm

RUN cd ${DISTDIR}
RUN pnpm install
RUN pnpm cache clean
RUN ln -s "${DISTDIR}"/packages/cli/dist/cjs/index.js /usr/local/bin/graphql-inspector
RUN chmod +x /usr/local/bin/graphql-inspector