#
# ---- Args ----
ARG NODE_VERSION=20.16.0

#
# ---- Base ----
FROM node:$NODE_VERSION as base
WORKDIR /app
RUN npm set progress=false && npm config set depth 0

#
# ---- Dependencies ----
COPY package.json package-lock.json ./
COPY prisma ./prisma/
RUN npm ci
COPY . . 

#
# ---- Build ----
RUN npx prisma generate
RUN npm run build

#
# ---- lighter image to execution ----
# ---- use unprivileged user ---- 
FROM node:${NODE_VERSION}-slim as runtime
USER node
WORKDIR /app

COPY --from=base /app/dist ./dist
COPY --from=base /app/prisma ./
COPY --from=base package*.json ./

RUN npm ci --omit=dev

CMD ["npm", "run", "start"]