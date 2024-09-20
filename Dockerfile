#
# ---- Args ----
ARG NODE_VERSION=20.16.0

#
# ---- Base ----
FROM node:$NODE_VERSION AS base
WORKDIR /app
RUN npm set progress=false && npm config set depth 0

#
# ---- Dependencies ----
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci

COPY . . 

RUN npx prisma generate
RUN npm run build

#
# ---- lighter image to execution ----
# ---- use unprivileged user ---- 
FROM node:${NODE_VERSION}-bullseye-slim AS runtime
USER node
WORKDIR /app

COPY --from=base /app/dist ./dist
COPY --from=base /app/prisma ./
COPY --from=base /app/package*.json ./

WORKDIR /app

RUN npm ci --omit=dev

CMD ["npm", "run", "start:prod"]