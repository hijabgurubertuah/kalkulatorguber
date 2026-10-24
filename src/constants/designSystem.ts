// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.
/**
 * SISTEM DESAIN PERMANEN & ATURAN BAKU "KALKULATOR GUBER SMART"
 *
 * 1. Prinsip Utama:
 *    - Minimalis, bersih, ringkas, dan jelas; produk jadi profesional bukan prototipe.
 *    - Tanpa teks panjang / instruksi / bantuan / tutorial / tips / catatan / format file / peringatan.
 *    - Teks HANYA label singkat 1-3 kata, judul bagian singkat, pesan galat validasi bila terjadi,
 *      dan notifikasi hasil aksi (muncul 0,5 detik lalu hilang).
 *    - Placeholder kolom dikosongkan atau hanya contoh nilai murni.
 *    - DILARANG pill badge / kapsul / chip berbentuk tombol palsu yang tidak bisa diklik.
 *    - DILARANG ikon dekoratif tanpa fungsi. Ikon HANYA untuk kontrol interaktif fungsional.
 *
 * 2. Skema Warna:
 *    - Utama (Primary): #0D9488 (toska)
 *    - Sekunder (Secondary): #0F766E (toska tua)
 *    - Aksen (Accent): #2DD4BF (toska terang)
 *    - Latar Halaman: #F0FDFA
 *    - Permukaan Kartu & Tombol Angka: #FFFFFF
 *    - Teks Utama: #0F2E2C
 *    - Teks Sekunder: #3F6F6B
 *    - Garis Tepi (Border): #CCEBE7
 *    - Tombol Operator/Fungsi: bg #CCFBF1, text #0F766E
 *    - Tombol Sama Dengan (=): bg #0F766E, text #FFFFFF
 *    - Tombol Hapus (C): bg #FEF2F2, text #DC2626
 *
 * 3. Tipografi:
 *    - Judul: "Plus Jakarta Sans"
 *    - Isi & Angka Layar: "Inter" dengan tabular numbers
 *
 * 4. Geometri & Spasi:
 *    - Sudut membulat kartu: 16px (rounded-2xl atau rounded-[16px])
 *    - Sudut membulat tombol: 14px (rounded-[14px])
 *    - Bayangan lembut konsisten
 *    - Area sentuh tombol minimal 44px (min-h-[44px], min-w-[44px])
 *    - Jarak lega, tampilan compact di HP
 *
 * 5. Tampilan HP (Prioritas Utama):
 *    - Header HP HANYA memuat nama "Kalkulator Guber Smart". Tidak ada hamburger di header!
 *    - Tombol pembuka sidebar di HP: posisi di tepi kiri layar, tepat di tengah tinggi layar
 *      (fixed left-0 top-1/2 -translate-y-1/2), tinggi 120px, lebar 25px, membulat di kanan,
 *      warna tema toska dengan sedikit transparansi (#0D9488/90), hanya berisi 1 ikon hamburger fungsional.
 *    - Sidebar HP: backdrop gelap, layar belakang terkunci, ketuk luar untuk tutup, item vertikal min 48px.
 *    - Footer di semua halaman: persis "by : Guber Smart", 14px, #3F6F6B, tanpa bingkai/tautan.
 *    - Notifikasi hasil aksi: otomatis hilang dalam 500ms (0,5 detik).
 *    - Tidak ada dark mode switch.
 */

export const THEME = {
  colors: {
    primary: '#0D9488',
    secondary: '#0F766E',
    accent: '#2DD4BF',
    background: '#F0FDFA',
    card: '#FFFFFF',
    textPrimary: '#0F2E2C',
    textSecondary: '#3F6F6B',
    border: '#CCEBE7',
    opBg: '#CCFBF1',
    opText: '#0F766E',
    equalBg: '#0F766E',
    equalText: '#FFFFFF',
    clearBg: '#FEF2F2',
    clearText: '#DC2626',
  },
  radius: {
    card: '16px',
    button: '14px',
  },
  footerText: 'by : Guber Smart',
  notificationDurationMs: 500,
} as const;
