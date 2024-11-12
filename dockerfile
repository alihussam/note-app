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
COPY --from=builder /usr/app/entrypoint.sh /usr/app/entrypoint.sh
COPY --from=builder /usr/app/node_modules /usr/app/node_modules
COPY --from=builder /usr/app/package.json /usr/app/package.json
COPY --from=builder /usr/app/.env.sample /usr/app/.env.sample
COPY --from=builder /usr/app/build /usr/app/build

ARG NODE_ENV="development"
ARG PORT="3000"
ARG ROUTE_PREFIX="/respond"

WORKDIR /usr/app

RUN cp .env.sample .env \
    && sed -i'' "s~{NODE_ENV}~${NODE_ENV}~g" .env \
    && sed -i'' "s~{PORT}~${PORT}~g" .env \
    && sed -i'' "s~{ROUTE_PREFIX}~${ROUTE_PREFIX}~g" .env

RUN chmod +x /usr/app/entrypoint.sh

EXPOSE 3000

ENTRYPOINT [ "/usr/app/entrypoint.sh" ]