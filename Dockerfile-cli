FROM node:10-slim

LABEL version="1.27.0"
LABEL repository="http://github.com/kamilkisiela/graphql-inspector"
LABEL homepage="http://github.com/kamilkisiela/graphql-inspector"
LABEL maintainer="Kamil Kisiela <kamil.kisiela@gmail.com>"

ENV LOG_LEVEL "debug"

RUN yarn global add @graphql-inspector/cli@1.27.0 graphql

RUN mkdir /app
WORKDIR /app
