FROM node:18-alpine

WORKDIR /app
COPY ../webhook/package*.json ./
RUN npm install
COPY ../webhook .

EXPOSE 8001
CMD ["node", "webhook.js"]

