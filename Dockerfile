# Menggunakan base image Node.js versi alpine
FROM node:20-alpine

# Tetapkan direktori kerja
WORKDIR /opt/app

# Instalasi alat-alat tambahan yang diperlukan untuk modul native seperti canvas
RUN apk add --no-cache \
    python3 \
    py3-pip \
    build-base \
    cairo-dev \
    pango-dev \
    jpeg-dev \
    giflib-dev \
    librsvg-dev

# Salin file package.json dan package-lock.json
COPY package*.json ./

# Instal dependensi Node.js
RUN npm install

# Salin semua file ke dalam image
COPY . .

# Tentukan port yang akan diekspos
EXPOSE 8080

# Tetapkan variabel environment
ENV DATABASE_URL=""
ENV DB_CA=""
ENV KEY_JWT=""
ENV GCS_BUCKET_NAME=""
ENV GOOGLE_APPLICATION_CREDENTIALS=""

# Perintah untuk menjalankan aplikasi
CMD ["npm", "run", "start"]