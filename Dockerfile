FROM node:20.11.0-alpine3.18

WORKDIR /backend_app

RUN apk update && apk add bash

COPY package*.json ./
RUN npm install
COPY . .

RUN ["npx", "prisma", "generate"]
RUN ["npm",  "run", "build"]

# Add wait-for-it
RUN chmod +x wait-for-it.sh

EXPOSE 3000

CMD ["./wait-for-it.sh" , "database:3306" , "--strict" , "--timeout=1300" , "--" , "npm",  "start"]

# TODO: change to non-root user
# create user
# RUN addgroup -S backend_user && adduser -S backend_user -G backend_user

# USER backend_user