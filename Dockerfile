# Dockerfile
FROM node:slim

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --omit=dev

RUN npm install -g @nestjs/cli

COPY . .

RUN npm run build

RUN npm prune --omit=dev

EXPOSE 3000

CMD ["npm", "run", "start"]
#CMD ["node", "dist/main.js"]