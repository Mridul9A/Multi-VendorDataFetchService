FROM node:18-alpine

WORKDIR /app
COPY ../vendors/package*.json ./
RUN npm install
COPY ../vendors .

EXPOSE 9000
CMD ["node", "syncVendor.js"]
