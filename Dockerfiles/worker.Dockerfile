FROM node:18-alpine

WORKDIR /app
COPY ../worker/package*.json ./
RUN npm install
COPY ../worker .

CMD ["node", "worker.js"]
