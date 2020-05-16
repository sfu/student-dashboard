FROM node:12-alpine

ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8
ENV TZ 'America/Vancouver'

ARG DEFAULT_TZ='America/Vancouver'

RUN apk update && \
    apk upgrade && \
    apk add tzdata && \
    cp /usr/share/zoneinfo/${DEFAULT_TZ} /etc/localtime && \
    apk del tzdata && \
    rm -rf /var/cache/apk/*

WORKDIR /usr/src/app
COPY package*.json ./
COPY yarn.lock ./
RUN yarn install

COPY . .

CMD ["yarn", "start"]

EXPOSE 3000