FROM node:slim

LABEL repository="http://github.com/kamilkisiela/graphql-inspector"
LABEL homepage="http://github.com/kamilkisiela/graphql-inspector"
LABEL maintainer="Kamil Kisiela <kamil.kisiela@gmail.com>"

LABEL com.github.actions.name="PR Cleanup"
LABEL com.github.actions.description="Cleans up merged branches."
LABEL com.github.actions.icon="gear"
LABEL com.github.actions.color="red"

ENV LOG_LEVEL "debug"

COPY . .

RUN npm install

CMD ["node", "/index.js"]
