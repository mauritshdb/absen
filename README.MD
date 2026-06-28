# 📋 Absen — Aplikasi Manajemen Kehadiran

Aplikasi manajemen kehadiran berbasis web yang dibangun menggunakan **Next.js** dan **TypeScript**. Proyek ini dikembangkan sebagai tugas mata kuliah UI/UX.

---

## ✨ Fitur

- Pencatatan kehadiran secara digital
- Antarmuka pengguna yang bersih dan responsif
- Dibangun dengan komponen yang dapat digunakan ulang
- Dukungan TypeScript untuk keamanan tipe data

---

## 🛠️ Teknologi yang Digunakan

| Teknologi | Versi |
|---|---|
| [Next.js](https://nextjs.org/) | 14+ |
| [React](https://react.dev/) | 18+ |
| [TypeScript](https://www.typescriptlang.org/) | 5+ |
| [Tailwind CSS](https://tailwindcss.com/) | 3+ |

---

[![Watch the video](https://img.youtube.com/vi/2ABsHKZUBtk/maxresdefault.jpg)](https://youtu.be/2ABsHKZUBtk)

---

## ⚙️ Prasyarat

Pastikan perangkat Anda telah terinstal:

- **Node.js** v18 atau lebih baru — [unduh di sini](https://nodejs.org/)
- **npm**, **yarn**, **pnpm**, atau **bun**

Verifikasi instalasi:

```bash
node -v
npm -v
```

---

## 🚀 Cara Menjalankan Proyek

### 1. Clone Repositori

```bash
git clone https://github.com/mauritshdb/absen.git
cd absen
```

### 2. Instal Dependensi

```bash
# npm
npm install

# yarn
yarn install

# pnpm
pnpm install

# bun
bun install
```

### 3. Jalankan Server Pengembangan

```bash
npm run dev
```

Buka browser dan kunjungi **[http://localhost:3000](http://localhost:3000)**

---

## 🏗️ Build untuk Produksi

```bash
# Buat build produksi
npm run build

# Jalankan server produksi
npm run start
```

---

## 📜 Perintah yang Tersedia

| Perintah | Deskripsi |
|---|---|
| `npm run dev` | Menjalankan server pengembangan |
| `npm run build` | Membuat build untuk produksi |
| `npm run start` | Menjalankan server produksi |
| `npm run lint` | Menjalankan pengecekan ESLint |

---

## 📁 Struktur Proyek

```
absen/
├── app/              # Halaman dengan App Router (Next.js)
├── components/       # Komponen UI yang dapat digunakan ulang
├── data/             # Data statis atau mock data
├── lib/              # Utilitas dan helper
├── public/           # Aset statis (gambar, ikon, dll.)
├── next.config.js    # Konfigurasi Next.js
├── tailwind.config   # Konfigurasi Tailwind CSS
├── tsconfig.json     # Konfigurasi TypeScript
├── package.json
└── README.MD
```

---

## 🔧 Pemecahan Masalah

**Dependensi bermasalah?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Cache Next.js perlu dibersihkan?**
```bash
rm -rf .next
npm run dev
```

---

## 👤 Kontributor

Dikembangkan oleh [mauritshdb](https://github.com/mauritshdb) dan kontributor.

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).
