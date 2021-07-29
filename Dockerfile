FROM node:16-alpine3.11

RUN mkdir -p /usr/local/app && chown -R node:node /usr/local/app

RUN apk update && apk upgrade
RUN apk add python3 build-base

WORKDIR /usr/local/app
COPY . /usr/local/app
RUN yarn install && yarn cache clean --force

#USER node

EXPOSE 3000

CMD [ "yarn", "install" ]
CMD [ "yarn", "start" ]
