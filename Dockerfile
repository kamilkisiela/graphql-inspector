FROM node:10

ENV PATH=$PATH:/app/node_modules/.bin
WORKDIR /app
COPY . .
RUN yarn

ENTRYPOINT ["probot", "receive"]
CMD ["/app/index.js"]
