# syntax=docker/dockerfile:1.7-labs
# TeleRAD OHIF image: upstream build (Node 24 / pnpm) + the same nginx app.conf used in
# production, which serves the app and proxies /dicom-web, /wado… to orthanc-pacs:8042.
#
#   docker build -f .docker/TeleRAD/Dockerfile -t telerad/ohif:3.13 .
#
FROM node:24.22.2-slim AS builder
RUN apt-get update && apt-get install -y --no-install-recommends build-essential python3 \
    && rm -rf /var/lib/apt/lists/*
RUN npm install -g pnpm@12
WORKDIR /usr/src/app
ENV PATH=/usr/src/app/node_modules/.bin:$PATH
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc preinstall.js ./
COPY --parents ./extensions/*/package.json ./modes/*/package.json ./platform/*/package.json ./
# --no-frozen-lockfile: .dockerignore leaves platform/docs out, which the lockfile lists (same as upstream).
RUN pnpm install --no-frozen-lockfile
COPY --link --exclude=Dockerfile . .
ENV QUICK_BUILD=true
ENV APP_CONFIG=config/telerad-orthanc.js
ENV PUBLIC_URL=/
RUN pnpm run show:config
RUN pnpm run build

FROM nginx:1.27-alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY .docker/TeleRAD/app.conf /etc/nginx/conf.d/app.conf
COPY --from=builder /usr/src/app/platform/app/dist /var/www/html
