FROM simonfraseruniversity/base-nodejs-alpine:latest

RUN apk update && apk add git
WORKDIR /usr/src/app
COPY package*.json ./
COPY yarn.lock ./
RUN yarn install

COPY . .

CMD ["yarn", "start"]

EXPOSE 3000