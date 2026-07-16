/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Role = 'Warga' | 'Pengurus' | 'Satpam';

export interface Warga {
  id: string;
  nama: string;
  nik: string;
  noHp: string;
  alamat: string;
  statusTinggal: 'Tetap' | 'Kontrak';
  statusPekerjaan: string;
  foto?: string; // base64 or placeholder
  role: Role;
  rt: string;
  rw: string;
  createdAt: string;
  updatedAt: string;
}

export interface SuratPengantar {
  id: string;
  wargaId: string;
  wargaNama: string;
  jenis: 'KTP' | 'KK' | 'SKCK' | 'Lainnya';
  keterangan: string;
  status: 'Diajukan' | 'Diproses' | 'Selesai' | 'Ditolak';
  catatanPengurus?: string;
  tandaTanganWarga?: string; // base64/canvas drawing
  tandaTanganPengurus?: string; // base64/canvas drawing
  createdAt: string;
  updatedAt: string;
}

export interface MasterIuran {
  id: string;
  nama: string;
  nominal: number;
  deskripsi: string;
}

export interface TagihanIuran {
  id: string;
  wargaId: string;
  wargaNama: string;
  masterIuranId: string;
  masterIuranNama: string;
  bulan: string; // YYYY-MM
  nominal: number;
  status: 'Lunas' | 'Belum Bayar' | 'Jatuh Tempo';
  tanggalBayar: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PengeluaranKas {
  id: string;
  judul: string;
  nominal: number;
  kategori: 'Operasional' | 'Kegiatan' | 'Keamanan' | 'Lainnya';
  tanggal: string;
  keterangan: string;
  createdAt: string;
}

export interface Pengumuman {
  id: string;
  judul: string;
  isi: string;
  kategori: 'Kegiatan' | 'Informasi' | 'Keamanan' | 'Lainnya';
  lampiranGambar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RSVPEvent {
  wargaId: string;
  wargaNama: string;
  status: 'Hadir' | 'Absen';
}

export interface KalenderKegiatan {
  id: string;
  judul: string;
  deskripsi: string;
  tanggal: string; // YYYY-MM-DD
  waktu: string; // HH:MM
  lokasi: string;
  kategori: 'Kerja Bakti' | 'Rapat' | 'Posyandu' | 'Ronda' | 'Lainnya';
  rsvp: RSVPEvent[];
  createdAt: string;
}

export interface OpsiPolling {
  id: string;
  teks: string;
  votesCount: number;
}

export interface Polling {
  id: string;
  pertanyaan: string;
  opsi: OpsiPolling[];
  voters: string[]; // wargaId list
  pilihan: { [wargaId: string]: string }; // wargaId -> opsiId
  status: 'Aktif' | 'Selesai';
  createdAt: string;
}

export interface PanicAlert {
  id: string;
  wargaId: string;
  wargaNama: string;
  noHp: string;
  alamat: string;
  jenisDarurat: 'Kemalingan' | 'Kebakaran' | 'Medis' | 'Lainnya';
  keterangan: string;
  status: 'Aktif' | 'Ditangani' | 'Selesai';
  lokasiManual: string;
  createdAt: string;
}

export interface PetugasRonda {
  wargaId: string;
  nama: string;
}

export interface JadwalRonda {
  id: string;
  hari: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu' | 'Minggu';
  petugas: PetugasRonda[];
}

export interface AbsensiRonda {
  id: string;
  tanggal: string; // YYYY-MM-DD
  wargaId: string;
  wargaNama: string;
  waktuScan: string;
  status: 'Hadir' | 'Absen';
}

export interface LaporanTamu {
  id: string;
  namaTamu: string;
  nikTamu: string;
  tujuan: string;
  lamaTinggal: string;
  tanggalDatang: string;
  alamatTamu: string;
  pelaporId: string;
  pelaporNama: string;
  createdAt: string;
}

export interface TimelinePengaduan {
  status: 'Dilaporkan' | 'Diproses' | 'Selesai';
  catatan: string;
  tanggal: string;
}

export interface Pengaduan {
  id: string;
  wargaId: string;
  wargaNama: string;
  judul: string;
  deskripsi: string;
  kategori: 'Infrastruktur' | 'Kebersihan' | 'Keamanan' | 'Sosial' | 'Lainnya';
  foto?: string; // base64
  status: 'Dilaporkan' | 'Diproses' | 'Selesai';
  timeline: TimelinePengaduan[];
  createdAt: string;
}

export interface ProdukUMKM {
  id: string;
  wargaId: string;
  wargaNama: string;
  namaProduk: string;
  kategori: 'Makanan' | 'Pakaian' | 'Jasa' | 'Kerajinan' | 'Lainnya';
  harga: number;
  deskripsi: string;
  noHp: string; // whatsapp
  foto?: string; // base64
  createdAt: string;
}

export interface Fasilitas {
  id: string;
  nama: string;
  deskripsi: string;
  foto?: string;
}

export interface BookingFasilitas {
  id: string;
  fasilitasId: string;
  fasilitasNama: string;
  wargaId: string;
  wargaNama: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  jamMulai: string;
  jamSelesai: string;
  keperluan: string;
  status: 'Menunggu' | 'Disetujui' | 'Ditolak';
  createdAt: string;
}

export interface AppNotification {
  id: string;
  judul: string;
  pesan: string;
  tipe: 'info' | 'darurat' | 'keuangan' | 'surat' | 'pengaduan';
  readBy: string[]; // wargaId list
  createdAt: string;
}
