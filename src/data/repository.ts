/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Warga,
  SuratPengantar,
  MasterIuran,
  TagihanIuran,
  PengeluaranKas,
  Pengumuman,
  KalenderKegiatan,
  Polling,
  PanicAlert,
  JadwalRonda,
  AbsensiRonda,
  LaporanTamu,
  Pengaduan,
  ProdukUMKM,
  Fasilitas,
  BookingFasilitas,
  AppNotification
} from '../types';

// Keys for LocalStorage
const KEYS = {
  WARGA: 'rtdigital_warga',
  SURAT: 'rtdigital_surat',
  MASTER_IURAN: 'rtdigital_master_iuran',
  TAGIHAN: 'rtdigital_tagihan',
  PENGELUARAN_KAS: 'rtdigital_pengeluaran_kas',
  PENGUMUMAN: 'rtdigital_pengumuman',
  EVENT: 'rtdigital_event',
  POLLING: 'rtdigital_polling',
  PANIC: 'rtdigital_panic',
  JADWAL_RONDA: 'rtdigital_jadwal_ronda',
  ABSEN_RONDA: 'rtdigital_absen_ronda',
  TAMU: 'rtdigital_tamu',
  PENGADUAN: 'rtdigital_pengaduan',
  UMKM: 'rtdigital_umkm',
  FASILITAS: 'rtdigital_fasilitas',
  BOOKING: 'rtdigital_booking',
  NOTIF: 'rtdigital_notif',
  CURRENT_USER_ID: 'rtdigital_current_user_id',
};

// Seed Data
const SEED_WARGA: Warga[] = [
  {
    id: 'W-01',
    nama: 'Bambang Pamungkas',
    nik: '3171012345670001',
    noHp: '081234567890',
    alamat: 'Jl. Melati No. 01, RT 01/RW 05',
    statusTinggal: 'Tetap',
    statusPekerjaan: 'Karyawan Swasta (Ketua RT)',
    role: 'Pengurus',
    rt: '01',
    rw: '05',
    createdAt: '2026-01-10T08:00:00.000Z',
    updatedAt: '2026-01-10T08:00:00.000Z',
  },
  {
    id: 'W-02',
    nama: 'Susanti',
    nik: '3171012345670002',
    noHp: '081298765432',
    alamat: 'Jl. Melati No. 03, RT 01/RW 05',
    statusTinggal: 'Tetap',
    statusPekerjaan: 'Wiraswasta (Bendahara RT)',
    role: 'Pengurus',
    rt: '01',
    rw: '05',
    createdAt: '2026-01-11T09:00:00.000Z',
    updatedAt: '2026-01-11T09:00:00.000Z',
  },
  {
    id: 'W-03',
    nama: 'Gatot Subroto',
    nik: '3171012345670003',
    noHp: '081122334455',
    alamat: 'Pos Ronda RT 01',
    statusTinggal: 'Tetap',
    statusPekerjaan: 'Petugas Keamanan',
    role: 'Satpam',
    rt: '01',
    rw: '05',
    createdAt: '2026-01-12T08:00:00.000Z',
    updatedAt: '2026-01-12T08:00:00.000Z',
  },
  {
    id: 'W-04',
    nama: 'Budi Santoso',
    nik: '3171012345670004',
    noHp: '085211223344',
    alamat: 'Jl. Melati No. 05, RT 01/RW 05',
    statusTinggal: 'Tetap',
    statusPekerjaan: 'PNS',
    role: 'Warga',
    rt: '01',
    rw: '05',
    createdAt: '2026-01-15T10:00:00.000Z',
    updatedAt: '2026-01-15T10:00:00.000Z',
  },
  {
    id: 'W-05',
    nama: 'Siti Aminah',
    nik: '3171012345670005',
    noHp: '081344556677',
    alamat: 'Jl. Melati No. 07, RT 01/RW 05',
    statusTinggal: 'Tetap',
    statusPekerjaan: 'Ibu Rumah Tangga (UMKM Kuliner)',
    role: 'Warga',
    rt: '01',
    rw: '05',
    createdAt: '2026-01-16T11:00:00.000Z',
    updatedAt: '2026-01-16T11:00:00.000Z',
  },
  {
    id: 'W-06',
    nama: 'Ahmad Fauzi',
    nik: '3171012345670006',
    noHp: '081899001122',
    alamat: 'Jl. Melati No. 09, RT 01/RW 05',
    statusTinggal: 'Kontrak',
    statusPekerjaan: 'Driver Ojek Online',
    role: 'Warga',
    rt: '01',
    rw: '05',
    createdAt: '2026-02-01T14:00:00.000Z',
    updatedAt: '2026-02-01T14:00:00.000Z',
  },
  {
    id: 'W-07',
    nama: 'Dewi Lestari',
    nik: '3171012345670007',
    noHp: '085611112222',
    alamat: 'Jl. Mawar No. 02, RT 01/RW 05',
    statusTinggal: 'Tetap',
    statusPekerjaan: 'Guru',
    role: 'Warga',
    rt: '01',
    rw: '05',
    createdAt: '2026-02-10T09:30:00.000Z',
    updatedAt: '2026-02-10T09:30:00.000Z',
  },
  {
    id: 'W-08',
    nama: 'Hendra Wijaya',
    nik: '3171012345670008',
    noHp: '087812345678',
    alamat: 'Jl. Mawar No. 04, RT 01/RW 05',
    statusTinggal: 'Tetap',
    statusPekerjaan: 'Arsitek',
    role: 'Warga',
    rt: '01',
    rw: '05',
    createdAt: '2026-02-15T08:00:00.000Z',
    updatedAt: '2026-02-15T08:00:00.000Z',
  },
  {
    id: 'W-09',
    nama: 'Sri Wahyuni',
    nik: '3171012345670009',
    noHp: '081223344556',
    alamat: 'Jl. Mawar No. 06, RT 01/RW 05',
    statusTinggal: 'Tetap',
    statusPekerjaan: 'Bidan',
    role: 'Warga',
    rt: '01',
    rw: '05',
    createdAt: '2026-03-01T10:00:00.000Z',
    updatedAt: '2026-03-01T10:00:00.000Z',
  },
  {
    id: 'W-10',
    nama: 'Eko Prasetyo',
    nik: '3171012345670010',
    noHp: '085733445566',
    alamat: 'Jl. Mawar No. 08, RT 01/RW 05',
    statusTinggal: 'Kontrak',
    statusPekerjaan: 'Karyawan Bank',
    role: 'Warga',
    rt: '01',
    rw: '05',
    createdAt: '2026-03-05T15:00:00.000Z',
    updatedAt: '2026-03-05T15:00:00.000Z',
  },
  {
    id: 'W-11',
    nama: 'Rina Kartika',
    nik: '3171012345670011',
    noHp: '081900112233',
    alamat: 'Jl. Kenanga No. 02, RT 01/RW 05',
    statusTinggal: 'Tetap',
    statusPekerjaan: 'Desainer Grafis',
    role: 'Warga',
    rt: '01',
    rw: '05',
    createdAt: '2026-03-10T11:00:00.000Z',
    updatedAt: '2026-03-10T11:00:00.000Z',
  },
  {
    id: 'W-12',
    nama: 'Aris Setiawan',
    nik: '3171012345670012',
    noHp: '081288776655',
    alamat: 'Jl. Kenanga No. 04, RT 01/RW 05',
    statusTinggal: 'Tetap',
    statusPekerjaan: 'Dosen',
    role: 'Warga',
    rt: '01',
    rw: '05',
    createdAt: '2026-03-15T09:00:00.000Z',
    updatedAt: '2026-03-15T09:00:00.000Z',
  },
  {
    id: 'W-13',
    nama: 'Mega Utami',
    nik: '3171012345670013',
    noHp: '081399887766',
    alamat: 'Jl. Kenanga No. 06, RT 01/RW 05',
    statusTinggal: 'Kontrak',
    statusPekerjaan: 'Mahasiswi',
    role: 'Warga',
    rt: '01',
    rw: '05',
    createdAt: '2026-04-01T14:30:00.000Z',
    updatedAt: '2026-04-01T14:30:00.000Z',
  },
  {
    id: 'W-14',
    nama: 'Yusuf Habibi',
    nik: '3171012345670014',
    noHp: '082122334499',
    alamat: 'Jl. Kenanga No. 08, RT 01/RW 05',
    statusTinggal: 'Tetap',
    statusPekerjaan: 'Pegawai BUMN',
    role: 'Warga',
    rt: '01',
    rw: '05',
    createdAt: '2026-04-05T08:00:00.000Z',
    updatedAt: '2026-04-05T08:00:00.000Z',
  },
  {
    id: 'W-15',
    nama: 'Novi Anggraini',
    nik: '3171012345670015',
    noHp: '087755667788',
    alamat: 'Jl. Kenanga No. 10, RT 01/RW 05',
    statusTinggal: 'Tetap',
    statusPekerjaan: 'Ibu Rumah Tangga',
    role: 'Warga',
    rt: '01',
    rw: '05',
    createdAt: '2026-04-10T10:00:00.000Z',
    updatedAt: '2026-04-10T10:00:00.000Z',
  }
];

const SEED_MASTER_IURAN: MasterIuran[] = [
  { id: 'I-01', nama: 'Iuran Keamanan', nominal: 25000, deskripsi: 'Iuran bulanan untuk operasional pos ronda dan satpam RT' },
  { id: 'I-02', nama: 'Iuran Kebersihan', nominal: 15000, deskripsi: 'Iuran bulanan untuk pengangkutan sampah terpadu' },
  { id: 'I-03', nama: 'Dana Sosial Kematian', nominal: 10000, deskripsi: 'Iuran sukarela wajib untuk kas santunan kematian & warga sakit' }
];

const SEED_PENGELUARAN: PengeluaranKas[] = [
  {
    id: 'OUT-01',
    judul: 'Gaji Bulanan Satpam Gatot',
    nominal: 1800000,
    kategori: 'Keamanan',
    tanggal: '2026-06-30',
    keterangan: 'Gaji operasional bulanan petugas keamanan RT 01',
    createdAt: '2026-06-30T10:00:00.000Z',
  },
  {
    id: 'OUT-02',
    judul: 'Pembelian Lampu LED Jalan RT',
    nominal: 350000,
    kategori: 'Operasional',
    tanggal: '2026-07-02',
    keterangan: 'Beli 5 unit lampu LED Philips untuk penerangan Jl. Mawar dan Jl. Melati',
    createdAt: '2026-07-02T14:00:00.000Z',
  },
  {
    id: 'OUT-03',
    judul: 'Sewa Konsumsi Rapat Koordinasi',
    nominal: 250000,
    kategori: 'Kegiatan',
    tanggal: '2026-07-05',
    keterangan: 'Konsumsi snack dan air minum untuk rapat koordinasi keamanan',
    createdAt: '2026-07-05T16:00:00.000Z',
  }
];

const SEED_PENGUMUMAN: Pengumuman[] = [
  {
    id: 'ANN-01',
    judul: 'Kerja Bakti Massal Kebersihan Saluran Air',
    isi: 'Dihimbau kepada seluruh bapak-bapak warga RT 01/RW 05 untuk berpartisipasi dalam Kerja Bakti Massal membersihkan saluran air (selokan) untuk mencegah genangan air dan sarang nyamuk DBD. Mohon membawa peralatan masing-masing seperti sekop, cangkul, dan parang. Ibu-ibu dipersilakan membantu menyediakan konsumsi ringan.',
    kategori: 'Kegiatan',
    createdAt: '2026-07-10T07:00:00.000Z',
    updatedAt: '2026-07-10T07:00:00.000Z',
  },
  {
    id: 'ANN-02',
    judul: 'Pemberlakuan Wajib Lapor Tamu 1x24 Jam',
    isi: 'Mengingat aspek keamanan lingkungan, kami tegaskan kembali peraturan RT bahwa setiap warga yang menerima tamu menginap lebih dari 24 jam Wajib Melaporkan kepada Ketua RT atau petugas Keamanan (Satpam) melalui aplikasi RT/RW Digital ini atau langsung ke Pos Security. Pelanggaran berulang akan dikenakan teguran sosial.',
    kategori: 'Keamanan',
    createdAt: '2026-07-12T09:00:00.000Z',
    updatedAt: '2026-07-12T09:00:00.000Z',
  },
  {
    id: 'ANN-03',
    judul: 'Pelayanan Imunisasi Posyandu Mawar',
    isi: 'Jadwal rutin bulanan Posyandu Mawar akan diselenggarakan pada hari Sabtu ini di Balai Pertemuan RT 01. Pelayanan meliputi penimbangan balita, imunisasi dasar lengkap, pembagian makanan tambahan (PMT), serta pemeriksaan tensi lansia gratis. Diharapkan kehadiran ibu-ibu yang memiliki balita.',
    kategori: 'Informasi',
    createdAt: '2026-07-14T08:00:00.000Z',
    updatedAt: '2026-07-14T08:00:00.000Z',
  }
];

const SEED_EVENT: KalenderKegiatan[] = [
  {
    id: 'EVT-01',
    judul: 'Kerja Bakti Bersama Selokan',
    deskripsi: 'Kerja bakti membersihkan selokan utama mengantisipasi musim hujan.',
    tanggal: '2026-07-19',
    waktu: '07:30',
    lokasi: 'Selokan Utama Jl. Melati & Jl. Mawar',
    kategori: 'Kerja Bakti',
    rsvp: [
      { wargaId: 'W-04', wargaNama: 'Budi Santoso', status: 'Hadir' },
      { wargaId: 'W-06', wargaNama: 'Ahmad Fauzi', status: 'Hadir' },
      { wargaId: 'W-08', wargaNama: 'Hendra Wijaya', status: 'Hadir' },
    ],
    createdAt: '2026-07-10T07:00:00.000Z',
  },
  {
    id: 'EVT-02',
    judul: 'Posyandu Bulanan Mawar',
    deskripsi: 'Pemeriksaan balita dan pembagian PMT (Pemberian Makanan Tambahan).',
    tanggal: '2026-07-18',
    waktu: '08:00',
    lokasi: 'Balai Pertemuan Warga RT 01',
    kategori: 'Posyandu',
    rsvp: [
      { wargaId: 'W-05', wargaNama: 'Siti Aminah', status: 'Hadir' },
      { wargaId: 'W-09', wargaNama: 'Sri Wahyuni', status: 'Hadir' },
      { wargaId: 'W-15', wargaNama: 'Novi Anggraini', status: 'Hadir' },
    ],
    createdAt: '2026-07-14T08:00:00.000Z',
  },
  {
    id: 'EVT-03',
    judul: 'Rapat Koordinasi Pengurus RT',
    deskripsi: 'Evaluasi iuran kas bulanan dan peningkatan keamanan portal malam.',
    tanggal: '2026-07-25',
    waktu: '19:30',
    lokasi: 'Rumah Ketua RT (Bambang)',
    kategori: 'Rapat',
    rsvp: [],
    createdAt: '2026-07-15T12:00:00.000Z',
  }
];

const SEED_POLLING: Polling[] = [
  {
    id: 'POL-01',
    pertanyaan: 'Apakah setuju jika portal jalan utama ditutup total mulai jam 22:00 WIB demi keamanan?',
    opsi: [
      { id: 'opt-1', teks: 'Sangat Setuju (Portal ditutup jam 22.00)', votesCount: 7 },
      { id: 'opt-2', teks: 'Setuju (Portal ditutup jam 23.00)', votesCount: 5 },
      { id: 'opt-3', teks: 'Tidak Setuju (Portal biarkan terbuka)', votesCount: 1 }
    ],
    voters: ['W-04', 'W-05', 'W-06', 'W-07', 'W-08', 'W-09', 'W-10', 'W-11', 'W-12', 'W-13', 'W-14', 'W-15', 'W-01'],
    pilihan: {
      'W-04': 'opt-1',
      'W-05': 'opt-1',
      'W-06': 'opt-2',
      'W-07': 'opt-1',
      'W-08': 'opt-1',
      'W-09': 'opt-1',
      'W-10': 'opt-2',
      'W-11': 'opt-2',
      'W-12': 'opt-2',
      'W-13': 'opt-3',
      'W-14': 'opt-2',
      'W-15': 'opt-1',
      'W-01': 'opt-1',
    },
    status: 'Aktif',
    createdAt: '2026-07-08T09:00:00.000Z',
  },
  {
    id: 'POL-02',
    pertanyaan: 'Destinasi piknik warga RT 01 akhir tahun ini:',
    opsi: [
      { id: 'opt-a', teks: 'Pantai Anyer, Banten', votesCount: 0 },
      { id: 'opt-b', teks: 'Lembang, Bandung', votesCount: 0 },
      { id: 'opt-c', teks: 'Taman Safari, Bogor', votesCount: 0 }
    ],
    voters: [],
    pilihan: {},
    status: 'Aktif',
    createdAt: '2026-07-15T10:00:00.000Z',
  }
];

const SEED_JADWAL_RONDA: JadwalRonda[] = [
  { id: 'R-01', hari: 'Senin', petugas: [{ wargaId: 'W-04', nama: 'Budi Santoso' }, { wargaId: 'W-06', nama: 'Ahmad Fauzi' }] },
  { id: 'R-02', hari: 'Selasa', petugas: [{ wargaId: 'W-08', nama: 'Hendra Wijaya' }, { wargaId: 'W-10', nama: 'Eko Prasetyo' }] },
  { id: 'R-03', hari: 'Rabu', petugas: [{ wargaId: 'W-12', nama: 'Aris Setiawan' }, { wargaId: 'W-14', nama: 'Yusuf Habibi' }] },
  { id: 'R-04', hari: 'Kamis', petugas: [{ wargaId: 'W-01', nama: 'Bambang Pamungkas' }, { wargaId: 'W-04', nama: 'Budi Santoso' }] },
  { id: 'R-05', hari: 'Jumat', petugas: [{ wargaId: 'W-06', nama: 'Ahmad Fauzi' }, { wargaId: 'W-08', nama: 'Hendra Wijaya' }] },
  { id: 'R-06', hari: 'Sabtu', petugas: [{ wargaId: 'W-10', nama: 'Eko Prasetyo' }, { wargaId: 'W-12', nama: 'Aris Setiawan' }, { wargaId: 'W-14', nama: 'Yusuf Habibi' }] },
  { id: 'R-07', hari: 'Minggu', petugas: [{ wargaId: 'W-01', nama: 'Bambang Pamungkas' }, { wargaId: 'W-08', nama: 'Hendra Wijaya' }] },
];

const SEED_UMKM: ProdukUMKM[] = [
  {
    id: 'UMKM-01',
    wargaId: 'W-05',
    wargaNama: 'Siti Aminah',
    namaProduk: 'Nasi Uduk Gurih Bu Siti',
    kategori: 'Makanan',
    harga: 12000,
    deskripsi: 'Nasi uduk gurih wangi dengan lauk semur tahu, bihun, telur dadar iris, sambal merah pedas manis, dan kerupuk. Menerima pesanan nasi kotak / tumpeng.',
    noHp: '081344556677',
    createdAt: '2026-07-01T08:00:00.000Z',
  },
  {
    id: 'UMKM-02',
    wargaId: 'W-07',
    wargaNama: 'Dewi Lestari',
    namaProduk: 'Risol Mayo Keju Lumer (Isi 5)',
    kategori: 'Makanan',
    harga: 20000,
    deskripsi: 'Risol mayones isi potongan smoke beef premium, telur rebus, keju cheddar lumer, dan saus mayo creamy. Kulit renyah luar biasa!',
    noHp: '085611112222',
    createdAt: '2026-07-05T09:00:00.000Z',
  },
  {
    id: 'UMKM-03',
    wargaId: 'W-11',
    wargaNama: 'Rina Kartika',
    namaProduk: 'Jasa Desain Poster & Undangan Digital',
    kategori: 'Jasa',
    harga: 50000,
    deskripsi: 'Melayani jasa desain poster promosi, pamflet, feeds Instagram, undangan pernikahan/ulang tahun digital berformat video maupun gambar berkualitas tinggi.',
    noHp: '081900112233',
    createdAt: '2026-07-08T10:00:00.000Z',
  }
];

const SEED_FASILITAS: Fasilitas[] = [
  { id: 'FAS-01', nama: 'Balai Warga RT 01', deskripsi: 'Aula pertemuan berukuran 10x8 meter dengan fasilitas kipas angin besar, 50 kursi plastik, meja, dan sound system standar.' },
  { id: 'FAS-02', nama: 'Lapangan Olahraga Serbaguna', deskripsi: 'Lapangan semen serbaguna yang bisa digunakan untuk olahraga Bulutangkis, Voli, Futsal Anak, atau acara outdoor.' },
  { id: 'FAS-03', nama: 'Tenda Pesta & Kursi (Paket RT)', deskripsi: 'Paket tenda besi ukuran 4x6 meter, 2 set terpal, lengkap dengan 30 kursi lipat warga.' }
];

const SEED_BOOKING: BookingFasilitas[] = [
  {
    id: 'BKG-01',
    fasilitasId: 'FAS-01',
    fasilitasNama: 'Balai Warga RT 01',
    wargaId: 'W-04',
    wargaNama: 'Budi Santoso',
    tanggalMulai: '2026-07-20',
    tanggalSelesai: '2026-07-20',
    jamMulai: '13:00',
    jamSelesai: '17:00',
    keperluan: 'Syukuran Ulang Tahun Anak',
    status: 'Disetujui',
    createdAt: '2026-07-12T10:00:00.000Z',
  },
  {
    id: 'BKG-02',
    fasilitasId: 'FAS-03',
    fasilitasNama: 'Tenda Pesta & Kursi (Paket RT)',
    wargaId: 'W-08',
    wargaNama: 'Hendra Wijaya',
    tanggalMulai: '2026-07-26',
    tanggalSelesai: '2026-07-27',
    jamMulai: '08:00',
    jamSelesai: '21:00',
    keperluan: 'Khitanan Keluarga',
    status: 'Menunggu',
    createdAt: '2026-07-14T09:00:00.000Z',
  }
];

const SEED_PENGADUAN: Pengaduan[] = [
  {
    id: 'COMP-01',
    wargaId: 'W-06',
    wargaNama: 'Ahmad Fauzi',
    judul: 'Lampu Penerangan Dekat Portal Melati Mati',
    deskripsi: 'Lampu jalan yang menyorot portal jalan Melati sudah mati sekitar 3 hari terakhir. Sangat gelap saat malam hari dan rawan bagi warga yang pulang larut atau ojol.',
    kategori: 'Infrastruktur',
    status: 'Selesai',
    timeline: [
      { status: 'Dilaporkan', catatan: 'Pengaduan diterima oleh sistem', tanggal: '2026-07-01T15:00:00.000Z' },
      { status: 'Diproses', catatan: 'Petugas RT membeli lampu baru dan menjadwalkan penggantian', tanggal: '2026-07-02T09:00:00.000Z' },
      { status: 'Selesai', catatan: 'Lampu LED 19W baru sudah dipasang dan berfungsi kembali', tanggal: '2026-07-02T14:30:00.000Z' }
    ],
    createdAt: '2026-07-01T15:00:00.000Z',
  },
  {
    id: 'COMP-02',
    wargaId: 'W-08',
    wargaNama: 'Hendra Wijaya',
    judul: 'Penumpukan Sampah Bau di Samping Lapangan',
    deskripsi: 'Ada warga tidak dikenal membuang kantong sampah besar di pinggir lapangan serbaguna. Sampah mulai mengeluarkan bau tidak sedap dan mengundang lalat. Mohon dibantu teguran dan pengangkutan.',
    kategori: 'Kebersihan',
    status: 'Diproses',
    timeline: [
      { status: 'Dilaporkan', catatan: 'Pengaduan masuk', tanggal: '2026-07-14T10:00:00.000Z' },
      { status: 'Diproses', catatan: 'Sedang dikoordinasikan dengan petugas kebersihan pengangkut sampah hari ini', tanggal: '2026-07-15T08:00:00.000Z' }
    ],
    createdAt: '2026-07-14T10:00:00.000Z',
  }
];

const SEED_SURAT: SuratPengantar[] = [
  {
    id: 'SRT-01',
    wargaId: 'W-04',
    wargaNama: 'Budi Santoso',
    jenis: 'SKCK',
    keterangan: 'Keperluan mengurus perpanjangan kontrak kerja instansi kementerian.',
    status: 'Selesai',
    catatanPengurus: 'Silakan ambil hardcopy fisik surat pengantar di rumah RT atau download/cetak PDF dari sistem.',
    tandaTanganWarga: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="50"><text x="10" y="30" fill="blue" font-family="cursive">Budi</text></svg>',
    tandaTanganPengurus: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="50"><text x="10" y="30" fill="red" font-family="cursive">Bambang</text></svg>',
    createdAt: '2026-07-05T09:00:00.000Z',
    updatedAt: '2026-07-06T10:00:00.000Z',
  },
  {
    id: 'SRT-02',
    wargaId: 'W-06',
    wargaNama: 'Ahmad Fauzi',
    jenis: 'KK',
    keterangan: 'Pembuatan KK Baru karena baru menikah dan menyewa kontrakan di lingkungan RT 01.',
    status: 'Diajukan',
    tandaTanganWarga: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="50"><text x="10" y="30" fill="blue" font-family="cursive">Fauzi</text></svg>',
    createdAt: '2026-07-15T14:00:00.000Z',
    updatedAt: '2026-07-15T14:00:00.000Z',
  }
];

const SEED_TAMU: LaporanTamu[] = [
  {
    id: 'TMU-01',
    namaTamu: 'Sugeng Raharjo',
    nikTamu: '3515011212800002',
    tujuan: 'Menginap di rumah adik kandung (Ahmad Fauzi)',
    lamaTinggal: '3 Hari',
    tanggalDatang: '2026-07-12',
    alamatTamu: 'Sidoarjo, Jawa Timur',
    pelaporId: 'W-06',
    pelaporNama: 'Ahmad Fauzi',
    createdAt: '2026-07-12T14:30:00.000Z',
  }
];

const SEED_PANIC: PanicAlert[] = [
  {
    id: 'PAN-01',
    wargaId: 'W-06',
    wargaNama: 'Ahmad Fauzi',
    noHp: '081899001122',
    alamat: 'Jl. Melati No. 09, RT 01/RW 05',
    jenisDarurat: 'Medis',
    keterangan: 'Istri tiba-tiba mengalami kontraksi hebat menjelang persalinan jam 2 dini hari. Membutuhkan bantuan transportasi mobil warga atau bidan terdekat.',
    status: 'Selesai',
    lokasiManual: 'Jl. Melati No. 09',
    createdAt: '2026-07-05T02:15:00.000Z',
  }
];

const SEED_NOTIF: AppNotification[] = [
  {
    id: 'NTF-01',
    judul: 'Tagihan Iuran Baru Tersedia',
    pesan: 'Tagihan iuran RT periode Juli 2026 sudah diterbitkan. Silakan cek menu Keuangan & Tagihan Anda untuk konfirmasi pembayaran.',
    tipe: 'keuangan',
    readBy: ['W-01', 'W-04'],
    createdAt: '2026-07-01T07:00:00.000Z',
  },
  {
    id: 'NTF-02',
    judul: 'Kerja Bakti Minggu Ini',
    pesan: 'Jangan lupa berpartisipasi dalam Kerja Bakti membersihkan selokan pada hari Minggu besok pukul 07:30 WIB.',
    tipe: 'info',
    readBy: ['W-04'],
    createdAt: '2026-07-15T09:00:00.000Z',
  }
];

// Helper to seed bills for the past 2 months (June and July)
const generateBills = (wargaList: Warga[], masterList: MasterIuran[]): TagihanIuran[] => {
  const bills: TagihanIuran[] = [];
  const months = ['2026-06', '2026-07'];

  wargaList.forEach((w) => {
    if (w.role === 'Satpam') return; // Satpam doesn't pay bills

    months.forEach((m) => {
      masterList.forEach((mi) => {
        // Randomize some payments for June (mostly Lunas), some for July (mostly Belum Bayar)
        let status: 'Lunas' | 'Belum Bayar' | 'Jatuh Tempo' = 'Belum Bayar';
        let tanggalBayar: string | null = null;

        if (m === '2026-06') {
          // June is mostly paid
          const isUnpaid = w.id === 'W-06' || w.id === 'W-13'; // some unpaid
          status = isUnpaid ? 'Jatuh Tempo' : 'Lunas';
          tanggalBayar = isUnpaid ? null : '2026-06-10T09:00:00.000Z';
        } else {
          // July is ongoing
          const isPaid = w.id === 'W-01' || w.id === 'W-04' || w.id === 'W-08'; // some paid early
          status = isPaid ? 'Lunas' : 'Belum Bayar';
          tanggalBayar = isPaid ? '2026-07-05T10:00:00.000Z' : null;
        }

        bills.push({
          id: `BIL-${w.id}-${mi.id}-${m}`,
          wargaId: w.id,
          wargaNama: w.nama,
          masterIuranId: mi.id,
          masterIuranNama: mi.nama,
          bulan: m,
          nominal: mi.nominal,
          status,
          tanggalBayar,
          createdAt: `${m}-01T07:00:00.000Z`,
          updatedAt: `${m}-01T07:00:00.000Z`,
        });
      });
    });
  });

  return bills;
};

// Initialize DB with seed data if empty
export const initializeDB = (forceReset = false) => {
  if (forceReset || !localStorage.getItem(KEYS.WARGA)) {
    localStorage.setItem(KEYS.WARGA, JSON.stringify(SEED_WARGA));
    localStorage.setItem(KEYS.MASTER_IURAN, JSON.stringify(SEED_MASTER_IURAN));
    localStorage.setItem(KEYS.PENGELUARAN_KAS, JSON.stringify(SEED_PENGELUARAN));
    localStorage.setItem(KEYS.PENGUMUMAN, JSON.stringify(SEED_PENGUMUMAN));
    localStorage.setItem(KEYS.EVENT, JSON.stringify(SEED_EVENT));
    localStorage.setItem(KEYS.POLLING, JSON.stringify(SEED_POLLING));
    localStorage.setItem(KEYS.JADWAL_RONDA, JSON.stringify(SEED_JADWAL_RONDA));
    localStorage.setItem(KEYS.UMKM, JSON.stringify(SEED_UMKM));
    localStorage.setItem(KEYS.FASILITAS, JSON.stringify(SEED_FASILITAS));
    localStorage.setItem(KEYS.BOOKING, JSON.stringify(SEED_BOOKING));
    localStorage.setItem(KEYS.PENGADUAN, JSON.stringify(SEED_PENGADUAN));
    localStorage.setItem(KEYS.SURAT, JSON.stringify(SEED_SURAT));
    localStorage.setItem(KEYS.TAMU, JSON.stringify(SEED_TAMU));
    localStorage.setItem(KEYS.PANIC, JSON.stringify(SEED_PANIC));
    localStorage.setItem(KEYS.NOTIF, JSON.stringify(SEED_NOTIF));
    localStorage.setItem(KEYS.ABSEN_RONDA, JSON.stringify([]));

    const generated = generateBills(SEED_WARGA, SEED_MASTER_IURAN);
    localStorage.setItem(KEYS.TAGIHAN, JSON.stringify(generated));

    // Default logged in user
    localStorage.setItem(KEYS.CURRENT_USER_ID, SEED_WARGA[0].id); // Bambang (Pengurus)
  }
};

// Access methods safely with JSON fallback
const getData = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const setData = <T>(key: string, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const repository = {
  // Current user / auth session
  getCurrentUser: (): Warga => {
    initializeDB();
    const id = localStorage.getItem(KEYS.CURRENT_USER_ID) || 'W-01';
    const users = getData<Warga>(KEYS.WARGA);
    const user = users.find((u) => u.id === id);
    return user || users[0];
  },

  setCurrentUser: (id: string): void => {
    localStorage.setItem(KEYS.CURRENT_USER_ID, id);
  },

  resetDemoData: (): void => {
    initializeDB(true);
  },

  // ----------------------------------------------------
  // WARGA (Citizens)
  // ----------------------------------------------------
  getWargaList: (): Warga[] => getData<Warga>(KEYS.WARGA),

  getWargaById: (id: string): Warga | undefined => {
    return getData<Warga>(KEYS.WARGA).find((w) => w.id === id);
  },

  createWarga: (w: Omit<Warga, 'id' | 'createdAt' | 'updatedAt'>): Warga => {
    const list = getData<Warga>(KEYS.WARGA);
    const newId = `W-${String(list.length + 1).padStart(2, '0')}`;
    const now = new Date().toISOString();
    const entity: Warga = {
      ...w,
      id: newId,
      createdAt: now,
      updatedAt: now,
    };
    list.push(entity);
    setData(KEYS.WARGA, list);

    // Also auto-generate bills for this new resident for June and July
    const masters = getData<MasterIuran>(KEYS.MASTER_IURAN);
    const bills = getData<TagihanIuran>(KEYS.TAGIHAN);
    const months = ['2026-06', '2026-07'];
    months.forEach((m) => {
      masters.forEach((mi) => {
        bills.push({
          id: `BIL-${newId}-${mi.id}-${m}`,
          wargaId: newId,
          wargaNama: entity.nama,
          masterIuranId: mi.id,
          masterIuranNama: mi.nama,
          bulan: m,
          nominal: mi.nominal,
          status: 'Belum Bayar',
          tanggalBayar: null,
          createdAt: now,
          updatedAt: now,
        });
      });
    });
    setData(KEYS.TAGIHAN, bills);

    return entity;
  },

  updateWarga: (id: string, updates: Partial<Warga>): Warga => {
    const list = getData<Warga>(KEYS.WARGA);
    const idx = list.findIndex((w) => w.id === id);
    if (idx === -1) throw new Error('Warga tidak ditemukan');

    const updated: Warga = {
      ...list[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    list[idx] = updated;
    setData(KEYS.WARGA, list);

    // Also sync the name across bills, bookings, complaints, etc. if name changed
    if (updates.nama) {
      // sync bills
      const bills = getData<TagihanIuran>(KEYS.TAGIHAN);
      bills.forEach((b) => {
        if (b.wargaId === id) b.wargaNama = updates.nama!;
      });
      setData(KEYS.TAGIHAN, bills);

      // sync bookings
      const bookings = getData<BookingFasilitas>(KEYS.BOOKING);
      bookings.forEach((b) => {
        if (b.wargaId === id) b.wargaNama = updates.nama!;
      });
      setData(KEYS.BOOKING, bookings);

      // sync complaints
      const complaints = getData<Pengaduan>(KEYS.PENGADUAN);
      complaints.forEach((c) => {
        if (c.wargaId === id) c.wargaNama = updates.nama!;
      });
      setData(KEYS.PENGADUAN, complaints);
    }

    return updated;
  },

  deleteWarga: (id: string): void => {
    const list = getData<Warga>(KEYS.WARGA).filter((w) => w.id !== id);
    setData(KEYS.WARGA, list);

    // Filter out bills
    const bills = getData<TagihanIuran>(KEYS.TAGIHAN).filter((b) => b.wargaId !== id);
    setData(KEYS.TAGIHAN, bills);
  },

  // ----------------------------------------------------
  // SURAT PENGANTAR (Letter Requests)
  // ----------------------------------------------------
  getSuratList: (): SuratPengantar[] => getData<SuratPengantar>(KEYS.SURAT),

  createSurat: (s: Omit<SuratPengantar, 'id' | 'createdAt' | 'updatedAt' | 'status'>): SuratPengantar => {
    const list = getData<SuratPengantar>(KEYS.SURAT);
    const newId = `SRT-${String(list.length + 1).padStart(3, '0')}`;
    const now = new Date().toISOString();
    const entity: SuratPengantar = {
      ...s,
      id: newId,
      status: 'Diajukan',
      createdAt: now,
      updatedAt: now,
    };
    list.push(entity);
    setData(KEYS.SURAT, list);

    // Create in-app notification for pengurus
    repository.createNotification({
      judul: 'Pengajuan Surat Baru',
      pesan: `Warga ${s.wargaNama} mengajukan surat pengantar jenis ${s.jenis}.`,
      tipe: 'surat',
    });

    return entity;
  },

  updateSuratStatus: (id: string, status: SuratPengantar['status'], catatanPengurus?: string, ttdPengurus?: string): SuratPengantar => {
    const list = getData<SuratPengantar>(KEYS.SURAT);
    const idx = list.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error('Surat tidak ditemukan');

    const updated: SuratPengantar = {
      ...list[idx],
      status,
      catatanPengurus: catatanPengurus !== undefined ? catatanPengurus : list[idx].catatanPengurus,
      tandaTanganPengurus: ttdPengurus !== undefined ? ttdPengurus : list[idx].tandaTanganPengurus,
      updatedAt: new Date().toISOString(),
    };
    list[idx] = updated;
    setData(KEYS.SURAT, list);

    // Notify the citizen
    repository.createNotification({
      judul: `Status Surat: ${status}`,
      pesan: `Pengajuan Surat Pengantar ${updated.jenis} Anda telah ${status.toLowerCase()}. ${catatanPengurus ? `Catatan: ${catatanPengurus}` : ''}`,
      tipe: 'surat',
    });

    return updated;
  },

  // ----------------------------------------------------
  // IURAN & KEUANGAN (Finance)
  // ----------------------------------------------------
  getMasterIuranList: (): MasterIuran[] => getData<MasterIuran>(KEYS.MASTER_IURAN),

  getTagihanList: (): TagihanIuran[] => getData<TagihanIuran>(KEYS.TAGIHAN),

  payTagihan: (id: string): TagihanIuran => {
    const list = getData<TagihanIuran>(KEYS.TAGIHAN);
    const idx = list.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error('Tagihan tidak ditemukan');

    const updated: TagihanIuran = {
      ...list[idx],
      status: 'Lunas',
      tanggalBayar: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    list[idx] = updated;
    setData(KEYS.TAGIHAN, list);

    // Notify bendahara/pengurus
    repository.createNotification({
      judul: 'Pembayaran Iuran Lunas',
      pesan: `Warga ${updated.wargaNama} telah melunasi ${updated.masterIuranNama} bulan ${updated.bulan}.`,
      tipe: 'keuangan',
    });

    return updated;
  },

  getPengeluaranList: (): PengeluaranKas[] => getData<PengeluaranKas>(KEYS.PENGELUARAN_KAS),

  createPengeluaran: (p: Omit<PengeluaranKas, 'id' | 'createdAt'>): PengeluaranKas => {
    const list = getData<PengeluaranKas>(KEYS.PENGELUARAN_KAS);
    const newId = `OUT-${String(list.length + 1).padStart(3, '0')}`;
    const entity: PengeluaranKas = {
      ...p,
      id: newId,
      createdAt: new Date().toISOString(),
    };
    list.push(entity);
    setData(KEYS.PENGELUARAN_KAS, list);

    return entity;
  },

  // Calculate kas balance
  getKasStats: () => {
    const tagihans = getData<TagihanIuran>(KEYS.TAGIHAN);
    const pengeluarans = getData<PengeluaranKas>(KEYS.PENGELUARAN_KAS);

    const totalPemasukan = tagihans
      .filter((t) => t.status === 'Lunas')
      .reduce((acc, curr) => acc + curr.nominal, 0);

    const totalPengeluaran = pengeluarans
      .reduce((acc, curr) => acc + curr.nominal, 0);

    const saldo = totalPemasukan - totalPengeluaran;

    return {
      totalPemasukan,
      totalPengeluaran,
      saldo,
    };
  },

  // ----------------------------------------------------
  // PAPAN PENGUMUMAN (Announcements)
  // ----------------------------------------------------
  getPengumumanList: (): Pengumuman[] => {
    // Sort descending by date
    return getData<Pengumuman>(KEYS.PENGUMUMAN).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  createPengumuman: (p: Omit<Pengumuman, 'id' | 'createdAt' | 'updatedAt'>): Pengumuman => {
    const list = getData<Pengumuman>(KEYS.PENGUMUMAN);
    const newId = `ANN-${String(list.length + 1).padStart(3, '0')}`;
    const now = new Date().toISOString();
    const entity: Pengumuman = {
      ...p,
      id: newId,
      createdAt: now,
      updatedAt: now,
    };
    list.push(entity);
    setData(KEYS.PENGUMUMAN, list);

    // Notify citizens
    repository.createNotification({
      judul: `Pengumuman Baru: ${p.judul}`,
      pesan: p.isi.substring(0, 100) + '...',
      tipe: 'info',
    });

    return entity;
  },

  // ----------------------------------------------------
  // KALENDER KEGIATAN (Events)
  // ----------------------------------------------------
  getEventList: (): KalenderKegiatan[] => getData<KalenderKegiatan>(KEYS.EVENT),

  createEvent: (e: Omit<KalenderKegiatan, 'id' | 'createdAt' | 'rsvp'>): KalenderKegiatan => {
    const list = getData<KalenderKegiatan>(KEYS.EVENT);
    const newId = `EVT-${String(list.length + 1).padStart(3, '0')}`;
    const entity: KalenderKegiatan = {
      ...e,
      id: newId,
      rsvp: [],
      createdAt: new Date().toISOString(),
    };
    list.push(entity);
    setData(KEYS.EVENT, list);

    repository.createNotification({
      judul: `Kegiatan Baru Dijadwalkan`,
      pesan: `${e.judul} pada tanggal ${e.tanggal} jam ${e.waktu} di ${e.lokasi}.`,
      tipe: 'info',
    });

    return entity;
  },

  rsvpEvent: (eventId: string, wargaId: string, wargaNama: string, status: 'Hadir' | 'Absen'): KalenderKegiatan => {
    const list = getData<KalenderKegiatan>(KEYS.EVENT);
    const idx = list.findIndex((e) => e.id === eventId);
    if (idx === -1) throw new Error('Kegiatan tidak ditemukan');

    const event = list[idx];
    const rsvpIdx = event.rsvp.findIndex((r) => r.wargaId === wargaId);

    if (rsvpIdx > -1) {
      event.rsvp[rsvpIdx].status = status;
    } else {
      event.rsvp.push({ wargaId, wargaNama, status });
    }

    list[idx] = event;
    setData(KEYS.EVENT, list);
    return event;
  },

  // ----------------------------------------------------
  // POLLING / VOTING
  // ----------------------------------------------------
  getPollingList: (): Polling[] => getData<Polling>(KEYS.POLLING),

  createPolling: (p: { pertanyaan: string; opsiTeks: string[] }): Polling => {
    const list = getData<Polling>(KEYS.POLLING);
    const newId = `POL-${String(list.length + 1).padStart(2, '0')}`;
    const entity: Polling = {
      id: newId,
      pertanyaan: p.pertanyaan,
      opsi: p.opsiTeks.map((teks, index) => ({ id: `opt-${index + 1}`, teks, votesCount: 0 })),
      voters: [],
      pilihan: {},
      status: 'Aktif',
      createdAt: new Date().toISOString(),
    };
    list.push(entity);
    setData(KEYS.POLLING, list);

    repository.createNotification({
      judul: 'Polling Aspirasi Warga',
      pesan: `Pengurus membuka polling baru: "${p.pertanyaan}". Berikan suara Anda sekarang!`,
      tipe: 'info',
    });

    return entity;
  },

  votePolling: (pollingId: string, wargaId: string, opsiId: string): Polling => {
    const list = getData<Polling>(KEYS.POLLING);
    const idx = list.findIndex((p) => p.id === pollingId);
    if (idx === -1) throw new Error('Polling tidak ditemukan');

    const pol = list[idx];
    if (pol.voters.includes(wargaId)) {
      // Change vote
      const prevOpsiId = pol.pilihan[wargaId];
      if (prevOpsiId === opsiId) return pol; // same choice, do nothing

      // Decrease old vote count
      const oldOpsi = pol.opsi.find((o) => o.id === prevOpsiId);
      if (oldOpsi) oldOpsi.votesCount = Math.max(0, oldOpsi.votesCount - 1);

      // Increase new vote count
      const newOpsi = pol.opsi.find((o) => o.id === opsiId);
      if (newOpsi) newOpsi.votesCount += 1;

      pol.pilihan[wargaId] = opsiId;
    } else {
      // New vote
      pol.voters.push(wargaId);
      pol.pilihan[wargaId] = opsiId;

      const opsi = pol.opsi.find((o) => o.id === opsiId);
      if (opsi) opsi.votesCount += 1;
    }

    list[idx] = pol;
    setData(KEYS.POLLING, list);
    return pol;
  },

  closePolling: (id: string): Polling => {
    const list = getData<Polling>(KEYS.POLLING);
    const idx = list.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Polling tidak ditemukan');

    list[idx].status = 'Selesai';
    setData(KEYS.POLLING, list);
    return list[idx];
  },

  // ----------------------------------------------------
  // PANIC BUTTON & KEAMANAN
  // ----------------------------------------------------
  getPanicAlertList: (): PanicAlert[] => {
    return getData<PanicAlert>(KEYS.PANIC).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  triggerPanicAlert: (wargaId: string, jenis: PanicAlert['jenisDarurat'], ket: string, lokasi: string): PanicAlert => {
    const list = getData<PanicAlert>(KEYS.PANIC);
    const newId = `PAN-${String(list.length + 1).padStart(3, '0')}`;
    const warga = repository.getWargaById(wargaId);

    const entity: PanicAlert = {
      id: newId,
      wargaId,
      wargaNama: warga?.nama || 'Warga Anonim',
      noHp: warga?.noHp || '-',
      alamat: warga?.alamat || '-',
      jenisDarurat: jenis,
      keterangan: ket,
      status: 'Aktif',
      lokasiManual: lokasi || warga?.alamat || '-',
      createdAt: new Date().toISOString(),
    };
    list.push(entity);
    setData(KEYS.PANIC, list);

    // Create a major emergency notification
    repository.createNotification({
      judul: `🚨 DARURAT: ${jenis}!`,
      pesan: `Warga ${entity.wargaNama} membunyikan tombol darurat di ${entity.lokasiManual}. Hubungi: ${entity.noHp}`,
      tipe: 'darurat',
    });

    return entity;
  },

  updatePanicStatus: (id: string, status: PanicAlert['status']): PanicAlert => {
    const list = getData<PanicAlert>(KEYS.PANIC);
    const idx = list.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Alert tidak ditemukan');

    list[idx].status = status;
    setData(KEYS.PANIC, list);
    return list[idx];
  },

  // ----------------------------------------------------
  // JADWAL & ABSENSI RONDA
  // ----------------------------------------------------
  getJadwalRonda: (): JadwalRonda[] => getData<JadwalRonda>(KEYS.JADWAL_RONDA),

  saveJadwalRonda: (j: JadwalRonda[]): void => {
    setData(KEYS.JADWAL_RONDA, j);
  },

  getAbsensiRonda: (): AbsensiRonda[] => getData<AbsensiRonda>(KEYS.ABSEN_RONDA),

  recordAbsensiRonda: (wargaId: string, wargaNama: string): AbsensiRonda => {
    const list = getData<AbsensiRonda>(KEYS.ABSEN_RONDA);
    const newId = `ABS-${Date.now()}`;
    const todayStr = new Date().toISOString().substring(0, 10);
    const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    // Check if already checked in today
    const exists = list.find((a) => a.tanggal === todayStr && a.wargaId === wargaId);
    if (exists) return exists;

    const entity: AbsensiRonda = {
      id: newId,
      tanggal: todayStr,
      wargaId,
      wargaNama,
      waktuScan: timeStr,
      status: 'Hadir',
    };
    list.push(entity);
    setData(KEYS.ABSEN_RONDA, list);
    return entity;
  },

  // ----------------------------------------------------
  // LAPORAN TAMU (>24 Jam)
  // ----------------------------------------------------
  getLaporanTamuList: (): LaporanTamu[] => {
    return getData<LaporanTamu>(KEYS.TAMU).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  createLaporanTamu: (t: Omit<LaporanTamu, 'id' | 'createdAt'>): LaporanTamu => {
    const list = getData<LaporanTamu>(KEYS.TAMU);
    const newId = `TMU-${String(list.length + 1).padStart(3, '0')}`;
    const entity: LaporanTamu = {
      ...t,
      id: newId,
      createdAt: new Date().toISOString(),
    };
    list.push(entity);
    setData(KEYS.TAMU, list);

    repository.createNotification({
      judul: 'Laporan Tamu Baru',
      pesan: `Warga ${t.pelaporNama} melaporkan tamu menginap bernama ${t.namaTamu} selama ${t.lamaTinggal}.`,
      tipe: 'info',
    });

    return entity;
  },

  // ----------------------------------------------------
  // PENGADUAN & ASPIRASI
  // ----------------------------------------------------
  getPengaduanList: (): Pengaduan[] => {
    return getData<Pengaduan>(KEYS.PENGADUAN).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  createPengaduan: (p: Omit<Pengaduan, 'id' | 'status' | 'timeline' | 'createdAt'>): Pengaduan => {
    const list = getData<Pengaduan>(KEYS.PENGADUAN);
    const newId = `COMP-${String(list.length + 1).padStart(3, '0')}`;
    const now = new Date().toISOString();
    const entity: Pengaduan = {
      ...p,
      id: newId,
      status: 'Dilaporkan',
      timeline: [
        { status: 'Dilaporkan', catatan: 'Aduan berhasil dilaporkan oleh warga.', tanggal: now }
      ],
      createdAt: now,
    };
    list.push(entity);
    setData(KEYS.PENGADUAN, list);

    repository.createNotification({
      judul: 'Laporan Pengaduan Baru',
      pesan: `Warga ${p.wargaNama} melaporkan aduan: "${p.judul}".`,
      tipe: 'pengaduan',
    });

    return entity;
  },

  updatePengaduanStatus: (id: string, status: Pengaduan['status'], catatan: string): Pengaduan => {
    const list = getData<Pengaduan>(KEYS.PENGADUAN);
    const idx = list.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Pengaduan tidak ditemukan');

    const entry = list[idx];
    const now = new Date().toISOString();
    entry.status = status;
    entry.timeline.push({ status, catatan, tanggal: now });

    list[idx] = entry;
    setData(KEYS.PENGADUAN, list);

    // Notify citizen
    repository.createNotification({
      judul: `Aduan: ${status}`,
      pesan: `Laporan Anda "${entry.judul}" kini berstatus ${status.toLowerCase()}. Catatan: ${catatan}`,
      tipe: 'pengaduan',
    });

    return entry;
  },

  // ----------------------------------------------------
  // PASAR WARGA (UMKM)
  // ----------------------------------------------------
  getProdukUMKMList: (): ProdukUMKM[] => {
    return getData<ProdukUMKM>(KEYS.UMKM).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  createProdukUMKM: (p: Omit<ProdukUMKM, 'id' | 'createdAt'>): ProdukUMKM => {
    const list = getData<ProdukUMKM>(KEYS.UMKM);
    const newId = `UMKM-${String(list.length + 1).padStart(3, '0')}`;
    const entity: ProdukUMKM = {
      ...p,
      id: newId,
      createdAt: new Date().toISOString(),
    };
    list.push(entity);
    setData(KEYS.UMKM, list);

    return entity;
  },

  deleteProdukUMKM: (id: string): void => {
    const list = getData<ProdukUMKM>(KEYS.UMKM).filter((p) => p.id !== id);
    setData(KEYS.UMKM, list);
  },

  // ----------------------------------------------------
  // PEMINJAMAN FASILITAS
  // ----------------------------------------------------
  getFasilitasList: (): Fasilitas[] => getData<Fasilitas>(KEYS.FASILITAS),

  getBookingList: (): BookingFasilitas[] => {
    return getData<BookingFasilitas>(KEYS.BOOKING).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  createBooking: (b: Omit<BookingFasilitas, 'id' | 'status' | 'createdAt'>): BookingFasilitas => {
    const list = getData<BookingFasilitas>(KEYS.BOOKING);
    const newId = `BKG-${String(list.length + 1).padStart(3, '0')}`;

    // Validate double booking for same facility & date range
    const isDoubleBooked = list.some(
      (existing) =>
        existing.fasilitasId === b.fasilitasId &&
        existing.status === 'Disetujui' &&
        // Overlap date check:
        ((b.tanggalMulai >= existing.tanggalMulai && b.tanggalMulai <= existing.tanggalSelesai) ||
          (b.tanggalSelesai >= existing.tanggalMulai && b.tanggalSelesai <= existing.tanggalSelesai) ||
          (existing.tanggalMulai >= b.tanggalMulai && existing.tanggalMulai <= b.tanggalSelesai))
    );

    if (isDoubleBooked) {
      throw new Error('Fasilitas sudah dibooking oleh warga lain pada tanggal tersebut.');
    }

    const entity: BookingFasilitas = {
      ...b,
      id: newId,
      status: 'Menunggu',
      createdAt: new Date().toISOString(),
    };
    list.push(entity);
    setData(KEYS.BOOKING, list);

    repository.createNotification({
      judul: 'Booking Fasilitas Baru',
      pesan: `Warga ${b.wargaNama} memesan ${b.fasilitasNama} pada ${b.tanggalMulai}.`,
      tipe: 'info',
    });

    return entity;
  },

  updateBookingStatus: (id: string, status: BookingFasilitas['status']): BookingFasilitas => {
    const list = getData<BookingFasilitas>(KEYS.BOOKING);
    const idx = list.findIndex((b) => b.id === id);
    if (idx === -1) throw new Error('Booking tidak ditemukan');

    const item = list[idx];
    item.status = status;
    list[idx] = item;
    setData(KEYS.BOOKING, list);

    // Notify citizen
    repository.createNotification({
      judul: `Booking Fasilitas ${status}`,
      pesan: `Pengajuan pinjam ${item.fasilitasNama} untuk tanggal ${item.tanggalMulai} telah ${status.toLowerCase()}.`,
      tipe: 'info',
    });

    return item;
  },

  // ----------------------------------------------------
  // APP NOTIFICATIONS
  // ----------------------------------------------------
  getNotifications: (wargaId: string): AppNotification[] => {
    const all = getData<AppNotification>(KEYS.NOTIF);
    return all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getUnreadCount: (wargaId: string): number => {
    const all = getData<AppNotification>(KEYS.NOTIF);
    return all.filter((n) => !n.readBy.includes(wargaId)).length;
  },

  markNotificationsAsRead: (wargaId: string): void => {
    const all = getData<AppNotification>(KEYS.NOTIF);
    all.forEach((n) => {
      if (!n.readBy.includes(wargaId)) {
        n.readBy.push(wargaId);
      }
    });
    setData(KEYS.NOTIF, all);
  },

  createNotification: (n: { judul: string; pesan: string; tipe: AppNotification['tipe'] }): AppNotification => {
    const all = getData<AppNotification>(KEYS.NOTIF);
    const newId = `NTF-${Date.now()}`;
    const entity: AppNotification = {
      ...n,
      id: newId,
      readBy: [],
      createdAt: new Date().toISOString(),
    };
    all.push(entity);
    setData(KEYS.NOTIF, all);
    return entity;
  }
};
