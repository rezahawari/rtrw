/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Warga, Pengaduan as PengaduanType } from '../types';
import { repository } from '../data/repository';
import { Wrench, Plus, CheckCircle, Clock, AlertCircle, Eye, Search, X, MessageSquare } from 'lucide-react';

interface PengaduanProps {
  currentUser: Warga;
  triggerRefresh: number;
  onRefresh: () => void;
}

export const Pengaduan: React.FC<PengaduanProps> = ({ currentUser, triggerRefresh, onRefresh }) => {
  const [pengaduanList, setPengaduanList] = useState<PengaduanType[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAduan, setSelectedAduan] = useState<PengaduanType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Form fields
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [kategori, setKategori] = useState<PengaduanType['kategori']>('Infrastruktur');

  // Admin Progress notes field
  const [progressStatus, setProgressStatus] = useState<'Diproses' | 'Selesai'>('Diproses');
  const [progressNotes, setProgressNotes] = useState('');

  useEffect(() => {
    setPengaduanList(repository.getPengaduanList());
  }, [triggerRefresh]);

  const handleSubmitComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    repository.createPengaduan({
      wargaId: currentUser.id,
      wargaNama: currentUser.nama,
      judul,
      deskripsi,
      kategori,
    });

    setShowAddModal(false);
    setJudul('');
    setDeskripsi('');
    onRefresh();
  };

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAduan) return;
    if (!progressNotes.trim()) {
      alert('Mohon tuliskan catatan progres aduan.');
      return;
    }

    const updated = repository.updatePengaduanStatus(selectedAduan.id, progressStatus, progressNotes);
    setSelectedAduan(updated);
    setProgressNotes('');
    onRefresh();
  };

  const filteredList = pengaduanList.filter((p) => {
    const matchesSearch = p.judul.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.wargaNama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.deskripsi.toLowerCase().includes(searchQuery.toLowerCase());

    // Citizen only sees their complaints
    if (currentUser.role === 'Warga') {
      return matchesSearch && p.wargaId === currentUser.id;
    }
    return matchesSearch;
  });

  const isPengurus = currentUser.role === 'Pengurus';

  return (
    <div className="space-y-6">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-slate-800 flex items-center gap-2">
            <Wrench className="h-6 w-6 text-emerald-600" /> Pengaduan & Aspirasi Sarana
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Laporkan kerusakan jalan, lampu mati, sampah menumpuk, atau berikan saran perbaikan fasilitas.
          </p>
        </div>

        {currentUser.role === 'Warga' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-sm"
            id="add-complaint-button"
          >
            <Plus className="h-4 w-4" /> Buat Laporan Aduan
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center relative">
        <Search className="absolute left-7 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Cari kata kunci laporan, kategori, atau nama pengadu..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-slate-50"
        />
      </div>

      {/* Complaint Tickets list */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5">
        <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">
          {currentUser.role === 'Warga' ? 'Daftar Aduan Anda' : 'Antrian Pengaduan Masuk'}
        </h3>

        <div className="space-y-4">
          {filteredList.length > 0 ? (
            filteredList.map((p) => {
              const isReported = p.status === 'Dilaporkan';
              const isProcessing = p.status === 'Diproses';
              return (
                <div 
                  key={p.id} 
                  className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-slate-200 transition-colors"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-800 text-sm">{p.judul}</span>
                      <span className="text-slate-300 text-xs">•</span>
                      <span className="text-xs font-semibold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full uppercase">
                        {p.kategori}
                      </span>
                    </div>

                    <p className="text-slate-500 text-xs line-clamp-2 max-w-xl">{p.deskripsi}</p>
                    
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span>Oleh: <span className="font-bold text-slate-600">{p.wargaNama}</span></span>
                      <span>•</span>
                      <span>Tanggal: {new Date(p.createdAt).toLocaleDateString('id-ID')}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 w-full md:w-auto flex-shrink-0 justify-between md:justify-end border-t md:border-t-0 pt-2 md:pt-0 border-slate-200/50">
                    <div className="text-right">
                      <span className="text-[9px] text-slate-400 font-mono font-semibold block">ID: {p.id}</span>
                      <span className={`inline-flex items-center gap-0.5 font-bold text-[10px] px-2 py-0.5 rounded uppercase mt-1 ${
                        isReported ? 'bg-blue-100 text-blue-800' :
                        isProcessing ? 'bg-amber-100 text-amber-800 animate-pulse' : 'bg-green-100 text-green-800'
                      }`}>
                        {isReported ? <AlertCircle className="h-3 w-3" /> :
                         isProcessing ? <Clock className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3" />}
                        {p.status}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedAduan(p);
                        setShowDetailModal(true);
                      }}
                      className="bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 font-bold py-2 px-3.5 rounded-lg text-xs transition-colors flex items-center gap-1 w-full sm:w-auto justify-center"
                    >
                      <Eye className="h-3.5 w-3.5" /> Lihat Progres
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              Belum ada data laporan pengaduan masuk.
            </div>
          )}
        </div>
      </div>

      {/* CREATE COMPLAINT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowAddModal(false)} />
          
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col">
            
            <div className="bg-emerald-600 text-white px-6 py-4 flex justify-between items-center">
              <h3 className="font-bold text-base font-display">Ajukan Pengaduan Baru</h3>
              <button onClick={() => setShowAddModal(false)} className="hover:bg-emerald-700 p-1 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitComplaint} className="p-6 space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Judul Pengaduan / Keluhan</label>
                <input
                  type="text"
                  required
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  placeholder="Contoh: Lampu tiang listrik mati depan gang Melati"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Kategori Keluhan</label>
                <select
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden"
                >
                  <option value="Infrastruktur">Infrastruktur (Jalan, Selokan, Lampu)</option>
                  <option value="Kebersihan">Kebersihan (Penumpukan Sampah, Saluran mampet)</option>
                  <option value="Keamanan">Keamanan (Ronda, Gangguan portal)</option>
                  <option value="Sosial">Sosial / Tetangga (Keramaian, Perselisihan)</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Rincian Deskripsi Keluhan</label>
                <textarea
                  required
                  rows={4}
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  placeholder="Ceritakan detail keluhan atau aspirasi Anda secara lengkap. Sebutkan juga lokasi spesifik..."
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Submit */}
              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold py-2.5 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2.5 rounded-xl transition-colors shadow-sm"
                  id="submit-complaint"
                >
                  Kirim Pengaduan ✔️
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* DETAIL COMPLAINT & PROGRESS TIMELINE MODAL */}
      {showDetailModal && selectedAduan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowDetailModal(false)} />
          
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
            
            <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center">
              <h3 className="font-bold text-xs tracking-wider uppercase flex items-center gap-1.5">
                <Wrench className="h-4.5 w-4.5 text-emerald-400" /> TIMELINE PROGRES ADUAN
              </h3>
              <button onClick={() => setShowDetailModal(false)} className="hover:bg-slate-800 p-1 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50">
              
              {/* Core Complaint info */}
              <div className="bg-white p-5 rounded-xl border border-slate-200/60 space-y-2">
                <div className="flex justify-between items-start gap-2 flex-wrap">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-emerald-50 text-emerald-800">
                    {selectedAduan.kategori}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">ID: {selectedAduan.id}</span>
                </div>
                <h4 className="font-bold text-slate-800 text-sm leading-snug">{selectedAduan.judul}</h4>
                <p className="text-slate-600 text-xs leading-relaxed">"{selectedAduan.deskripsi}"</p>
                <div className="pt-2 border-t border-slate-100 flex justify-between text-[10px] text-slate-400">
                  <span>Pelapor: <b>{selectedAduan.wargaNama}</b></span>
                  <span>Dilaporkan pada: {new Date(selectedAduan.createdAt).toLocaleDateString('id-ID')}</span>
                </div>
              </div>

              {/* TIMELINE OF PROGRESS LOGS */}
              <div className="space-y-4">
                <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="h-4 w-4 text-emerald-600" /> Histori Penanganan Progres
                </h5>

                <div className="relative border-l-2 border-emerald-500/20 ml-3 space-y-5 py-2">
                  {selectedAduan.timeline.map((item, index) => {
                    const isLast = index === selectedAduan.timeline.length - 1;
                    return (
                      <div key={index} className="relative pl-6">
                        {/* Timeline dot */}
                        <div className={`absolute -left-[7px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs ${
                          item.status === 'Selesai' ? 'bg-green-600' :
                          item.status === 'Diproses' ? 'bg-amber-500' : 'bg-blue-600'
                        }`} />

                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-[10px] text-slate-400">
                            <span className={`font-bold uppercase ${
                              item.status === 'Selesai' ? 'text-green-700' :
                              item.status === 'Diproses' ? 'text-amber-700' : 'text-blue-700'
                            }`}>
                              Status: {item.status}
                            </span>
                            <span className="font-mono">{new Date(item.tanggal).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}</span>
                          </div>
                          <p className="text-slate-700 text-xs bg-white p-3 rounded-xl border border-slate-100 shadow-3xs leading-relaxed">
                            {item.catatan}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* INTERACTIVE CONTROLS FOR PENGURUS ONLY (Only visible if not Selesai yet) */}
              {isPengurus && selectedAduan.status !== 'Selesai' && (
                <form onSubmit={handleUpdateStatus} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
                  <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                    🛠️ Panel Update Pengurus RT
                  </h5>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Update Status Ke</label>
                      <select
                        value={progressStatus}
                        onChange={(e) => setProgressStatus(e.target.value as any)}
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden"
                      >
                        <option value="Diproses">Diproses (Sedang dikerjakan)</option>
                        <option value="Selesai">Selesai (Aduan Teratasi)</option>
                      </select>
                    </div>

                    <div className="flex items-end">
                      <p className="text-[10px] text-slate-400 leading-normal">
                        Perubahan status akan langsung dikirimkan ke dashboard pelapor dalam bentuk in-app notification.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Catatan Progres / Tindakan Pengurus</label>
                    <textarea
                      required
                      rows={2}
                      value={progressNotes}
                      onChange={(e) => setProgressNotes(e.target.value)}
                      placeholder="Tuliskan tindakan yang diambil RT. Contoh: Petugas kebersihan telah menjadwalkan pengangkutan sore ini pukul 16:00 WIB..."
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-xs transition-colors shadow-xs"
                    id="submit-aduan-update"
                  >
                    Simpan Progres Tindakan ✔️
                  </button>

                </form>
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
