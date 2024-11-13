ARG BASE_IMG="20.11-slim"

FROM node:$BASE_IMG AS builder

USER node

WORKDIR /usr/app
COPY --chown=node:node . ./

RUN npm i && \
    npm run build

COPY --chown=node:node . .


# RUN npm run build

FROM node:$BASE_IMG AS runner
COPY --from=builder /usr/app/node_modules /usr/app/node_modules
COPY --from=builder /usr/app/package.json /usr/app/package.json
COPY --from=builder /usr/app/.env.sample /usr/app/.env.sample
COPY --from=builder /usr/app/build /usr/app/build


WORKDIR /usr/app


EXPOSE 3000

CMD ["npm", "start"]