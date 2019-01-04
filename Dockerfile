FROM node:10

ENV PATH=$PATH:/app/node_modules/.bin
WORKDIR /app
COPY . .
RUN yarn
RUN yarn build

ENTRYPOINT ["probot", "receive"]
CMD ["/app/index.js"]
