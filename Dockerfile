# # Menggunakan base image Node.js versi alpine
# FROM node:20-alpine

# # Tetapkan direktori kerja
# WORKDIR /opt/app

# # Instalasi alat-alat tambahan yang diperlukan untuk modul native seperti canvas
# RUN apk add --no-cache \
#     python3 \
#     py3-pip \
#     build-base \
#     cairo-dev \
#     pango-dev \
#     jpeg-dev \
#     giflib-dev \
#     librsvg-dev

# # Salin file package.json dan package-lock.json
# COPY package*.json ./

# # Instal dependensi Node.js
# RUN npm install

# # Salin semua file ke dalam image
# COPY . .

# # Tentukan port yang akan diekspos
# EXPOSE 8080

# # Perintah untuk menjalankan aplikasi
# CMD ["npm", "run", "start"]

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

# Set environment mode ke production untuk optimasi
ENV NODE_ENV=production

# Salin file package.json dan package-lock.json lebih dulu untuk cache efisien
COPY package*.json ./

# Instal dependensi tanpa devDependencies
RUN npm install --omit=dev --progress=plain

# Salin semua file setelah npm install
COPY . .

# Tentukan port yang akan diekspos
EXPOSE 8080

# Perintah untuk menjalankan aplikasi
CMD ["npm", "run", "start"]
