FROM node:20-alpine

WORKDIR /opt/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8080

ENV DATABASE_URL=""
ENV DB_CA=""
ENV KEY_JWT=""
ENV GCS_BUCKET_NAME=""

CMD ["npm", "run", "dev"]