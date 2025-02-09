FROM ubuntu:latest
LABEL authors="otto marcus"

ENTRYPOINT ["top", "-b"]

# Dockerfile
FROM node:slim

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --omit=dev

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start"]
#CMD ["node", "dist/main.js"]