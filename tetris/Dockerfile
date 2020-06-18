FROM nginx:1.17.8-alpine as builder
COPY src /tetris/src
COPY package.json /tetris/package.json
COPY webpack.config.js /tetris/webpack.config.js
RUN apk add --update nodejs npm && cd tetris && npm install && npm run build


FROM nginx:1.17.8-alpine

COPY srvapi /srvapi
RUN apk add --update nodejs npm && cd srvapi && npm install

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

COPY nginx-srvapi.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /tetris/dist /usr/share/nginx/html

CMD ["/entrypoint.sh" ]


