# ImgToQR.io

Aplikasi web untuk menghasilkan QR code dari gambar dengan desain modern neobrutalism.

## 🚀 Fitur

- Upload gambar (JPG/PNG)
- Kompresi gambar otomatis
- Generate QR code dengan preview gambar
- Desain modern dengan gaya neobrutalism
- Responsif untuk semua ukuran layar
- Download QR code dalam format PNG

## 🛠️ Teknologi yang Digunakan

- Next.js 14
- TypeScript
- Tailwind CSS
- Framer Motion
- ImgBB API untuk hosting gambar
- QRCode.react untuk generate QR code

## 📦 Instalasi

1. Clone repository ini:

```bash
git clone https://github.com/ahyrnsrlh/ImgToQR.io.git
cd ImgToQR.io
```

2. Install dependensi:

```bash
npm install
```

3. Buat file `.env.local` dan tambahkan API key ImgBB:

```env
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key_here
```

4. Jalankan aplikasi:

```bash
npm run dev
```

5. Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## 🔑 Konfigurasi API Key

Untuk menggunakan aplikasi ini, Anda memerlukan API key dari ImgBB:

1. Kunjungi [ImgBB API](https://api.imgbb.com/)
2. Daftar dan dapatkan API key
3. Salin API key ke file `.env.local`

## 📝 Cara Penggunaan

1. Klik tombol "Upload Image"
2. Pilih gambar dari perangkat Anda (JPG/PNG, max 5MB)
3. Tunggu proses upload dan kompresi
4. Klik "Generate QR" untuk membuat QR code
5. Gunakan tombol "Download QR" untuk menyimpan QR code

## ⚙️ Pengembangan

Proyek ini menggunakan:

- ESLint untuk linting
- Prettier untuk formatting
- TypeScript untuk type checking

Perintah yang tersedia:

```bash
npm run dev        # Menjalankan development server
npm run build      # Build untuk production
npm run start      # Menjalankan versi production
npm run lint       # Menjalankan ESLint
```

## 🤝 Kontribusi

Kontribusi selalu diterima! Silakan:

1. Fork repository ini
2. Buat branch baru (`git checkout -b fitur-baru`)
3. Commit perubahan Anda (`git commit -m 'Menambah fitur baru'`)
4. Push ke branch tersebut (`git push origin fitur-baru`)
5. Buat Pull Request

## 📄 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).
