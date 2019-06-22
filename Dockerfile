FROM node:10-slim

LABEL version="1.21.0"
LABEL repository="http://github.com/kamilkisiela/graphql-inspector"
LABEL homepage="http://github.com/kamilkisiela/graphql-inspector"
LABEL maintainer="Kamil Kisiela <kamil.kisiela@gmail.com>"

LABEL com.github.actions.name="GraphQL Inspector"
LABEL com.github.actions.description="Tooling for GraphQL. Compare schemas, find breaking changes, find similar types."
LABEL com.github.actions.icon="search"
LABEL com.github.actions.color="orange"

ENV LOG_LEVEL "debug"

RUN yarn global add @graphql-inspector/actions@1.21.0

COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
