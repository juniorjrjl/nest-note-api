FROM node:22.13.0

RUN apt-get update && apt-get install -qq -y --no-install-recommends

ENV INSTALL_PATH=/nest-note-api

RUN mkdir -p "$INSTALL_PATH"

WORKDIR $INSTALL_PATH

RUN yarn global add @nestjs/cli@10.0.0

COPY package*.json .

RUN yarn install

COPY . .