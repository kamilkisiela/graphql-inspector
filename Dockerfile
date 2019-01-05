FROM node:10-slim

LABEL version="0.7.2"
LABEL repository="http://github.com/kamilkisiela/graphql-inspector"
LABEL homepage="http://github.com/kamilkisiela/graphql-inspector"
LABEL maintainer="Kamil Kisiela <kamil.kisiela@gmail.com>"

LABEL com.github.actions.name="GitHub Action for GraphQL Inspector"
LABEL com.github.actions.description="Tooling for GraphQL. Compare GraphQL Schemas, check documents, find breaking changes, find similar types."
LABEL com.github.actions.icon="notify"
LABEL com.github.actions.color="red"

ENV LOG_LEVEL 'debug'

RUN yarn global add @graphql-inspector/actions@0.7.2

COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
