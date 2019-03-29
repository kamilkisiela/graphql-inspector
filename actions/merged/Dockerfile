FROM node:slim

LABEL repository="http://github.com/kamilkisiela/graphql-inspector"
LABEL homepage="http://github.com/kamilkisiela/graphql-inspector"
LABEL maintainer="Kamil Kisiela <kamil.kisiela@gmail.com>"

LABEL com.github.actions.name="PR merged"
LABEL com.github.actions.description="Label related issues."
LABEL com.github.actions.icon="gear"
LABEL com.github.actions.color="green"

ENV LOG_LEVEL "debug"

COPY . .

RUN npm install

CMD ["node", "/index.js"]
