FROM node:18-alpine AS build

WORKDIR /app
COPY . /app

RUN set -ex \
  # Build JS-Application
  && npm install --production \
  && rm -rf /var/cache/apk/* \
  # Delete unnecessary files
  && rm package* \
  # Correct User's file access
  && chown -R node:node /app

ENV HTTP_PORT=8080
EXPOSE $HTTP_PORT
USER 1000
CMD ["node", "./index.js"]