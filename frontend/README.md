# URL Shortener Frontend

Frontend untuk aplikasi URL Shortener menggunakan Next.js dan TypeScript.

## Teknologi yang Digunakan

- **Next.js** - Framework React untuk aplikasi web
- **TypeScript** - Bahasa pemrograman yang menambahkan type checking ke JavaScript
- **TailwindCSS** - Framework CSS untuk styling
- **React Hook Form** - Library untuk manajemen form
- **Axios** - Library untuk HTTP requests

## Struktur Folder

- `/src/app` - Halaman Next.js menggunakan App Router
- `/src/components` - Komponen React yang digunakan di seluruh aplikasi
- `/src/lib` - Utility functions dan konfigurasi

## Fitur

- Halaman beranda dengan form untuk membuat URL pendek
- Dashboard untuk melihat dan mengelola semua URL yang telah dibuat
- Halaman login dan register
- Tampilan statistik URL (jumlah klik)
- Responsive design untuk desktop dan mobile

## Cara Menjalankan

1. Instal dependencies:

```bash
npm install
```

2. Jalankan server development:

```bash
npm run dev
```

3. Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## Integrasi dengan Backend

Frontend ini dirancang untuk berkomunikasi dengan backend Express.js. Pastikan backend sudah berjalan sebelum menggunakan fitur-fitur yang membutuhkan API seperti login, register, dan shortening URL.

## Build untuk Production

```bash
npm run build
npm start
```
