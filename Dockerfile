FROM node:15.12.0-alpine3.13
WORKDIR /app
COPY package.json /app/package.json
RUN apk add yarn
RUN yarn install 
COPY . /app
EXPOSE 3000
CMD ["yarn", "start"]