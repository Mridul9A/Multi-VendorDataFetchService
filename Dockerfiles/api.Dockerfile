FROM node:18-alpine

WORKDIR /app
COPY ../api/package*.json ./
RUN npm install
COPY ../api .

EXPOSE 8000
CMD ["node", "index.js"]
