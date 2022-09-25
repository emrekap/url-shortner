FROM node:lts as base

# Setting up global npm
RUN npm config set registry https://registry.npmjs.org/
RUN npm install -g npm


# Creating monorepo root
RUN mkdir /url-shortner


WORKDIR /url-shortner
COPY . ./

RUN npm ci

WORKDIR /url-shortner/prisma
RUN npx prisma generate

WORKDIR /url-shortner
# Compiling service source code
RUN npm run build

CMD ["npm", "run", "start:prod"]
