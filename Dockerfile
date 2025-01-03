FROM node:14-alpine

WORKDIR /usr/src/next

COPY *.* /usr/src/next

RUN npm install

COPY . /usr/src/next

RUN npm run build

CMD [ "npm" , "run" , "dev"]