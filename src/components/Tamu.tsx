/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Warga, LaporanTamu } from '../types';
import { repository } from '../data/repository';
import { UserCheck, Plus, ShieldCheck, Calendar, MapPin, Search, X } from 'lucide-react';

interface TamuProps {
  currentUser: Warga;
  triggerRefresh: number;
  onRefresh: () => void;
}

export const Tamu: React.FC<TamuProps> = ({ currentUser, triggerRefresh, onRefresh }) => {
  const [tamuList, setTamuList] = useState<LaporanTamu[]>([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form fields
  const [namaTamu, setNamaTamu] = useState('');
  const [nikTamu, setNikTamu] = useState('');
  const [tujuan, setTujuan] = useState('');
  const [lamaTinggal, setLamaTinggal] = useState('2 Hari');
  const [tanggalDatang, setTanggalDatang] = useState(new Date().toISOString().substring(0, 10));
  const [alamatTamu, setAlamatTamu] = useState('');

  useEffect(() => {
    setTamuList(repository.getLaporanTamuList());
  }, [triggerRefresh]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    repository.createLaporanTamu({
      namaTamu,
      nikTamu,
      tujuan,
      lamaTinggal,
      tanggalDatang,
      alamatTamu,
      pelaporId: currentUser.id,
      pelaporNama: currentUser.nama,
    });

    setShowFormModal(false);
    setNamaTamu('');
    setNikTamu('');
    setTujuan('');
    setLamaTinggal('2 Hari');
    setAlamatTamu('');
    onRefresh();
  };

  const filteredList = tamuList.filter((t) => {
    const matchesSearch = t.namaTamu.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.pelaporNama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.alamatTamu.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Standard Warga can only see guest reports they created, Satpam/Pengurus see everything
    if (currentUser.role === 'Warga') {
      return matchesSearch && t.pelaporId === currentUser.id;
    }
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-slate-800 flex items-center gap-2">
            <UserCheck className="h-6 w-6 text-emerald-600" /> Wajib Lapor Tamu &gt;24 Jam
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Form pendaftaran tamu yang berkunjung atau menginap di lingkungan RT 01 demi tertib administratif & keamanan.
          </p>
        </div>

        <button
          onClick={() => setShowFormModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-sm"
          id="add-guest-button"
        >
          <Plus className="h-4 w-4" /> Laporkan Tamu Baru
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center relative">
        <Search className="absolute left-7 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Cari nama tamu / nama warga pelapor / alamat..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-slate-50"
        />
      </div>

      {/* Guest Log History Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5">
        <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">
          {currentUser.role === 'Warga' ? 'Riwayat Laporan Tamu Anda' : 'Buku Tamu Lingkungan RT 01'}
        </h3>

        <div className="space-y-4">
          {filteredList.length > 0 ? (
            filteredList.map((t) => (
              <div 
                key={t.id} 
                className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-slate-200 transition-colors"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 text-sm">{t.namaTamu}</span>
                    <span className="text-slate-300 text-xs">•</span>
                    <span className="text-slate-500 text-xs font-semibold">Tinggal: {t.lamaTinggal}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-xs text-slate-500">
                    <p className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-slate-300" /> Asal: {t.alamatTamu}</p>
                    <p className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-slate-300" /> Datang: {new Date(t.tanggalDatang).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    <p className="flex items-center gap-1.5"><UserCheck className="h-3.5 w-3.5 text-slate-300" /> Dilaporkan oleh: <span className="font-semibold text-slate-700">{t.pelaporNama}</span></p>
                  </div>
                  
                  {t.tujuan && (
                    <p className="text-slate-600 text-xs bg-white/60 p-2 border border-slate-200/50 rounded-lg italic mt-1 max-w-xl">
                      "Tujuan: {t.tujuan}"
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-1 flex-shrink-0 text-right w-full md:w-auto border-t md:border-t-0 pt-2 md:pt-0 border-slate-200/50">
                  <span className="text-[9px] text-slate-400 font-mono font-semibold block">ID: {t.id}</span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded flex items-center gap-0.5 uppercase tracking-wider mt-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Tercatat Aman
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              Belum ada data laporan tamu masuk.
            </div>
          )}
        </div>
      </div>

      {/* ADD MODAL */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowFormModal(false)} />
          
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
            
            <div className="bg-emerald-600 text-white px-6 py-4 flex justify-between items-center">
              <h3 className="font-bold text-base font-display">Laporkan Tamu Menginap</h3>
              <button onClick={() => setShowFormModal(false)} className="hover:bg-emerald-700 p-1 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nama Lengkap Tamu</label>
                <input
                  type="text"
                  required
                  value={namaTamu}
                  onChange={(e) => setNamaTamu(e.target.value)}
                  placeholder="Contoh: Sugeng Raharjo"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Lama Menginap</label>
                  <select
                    value={lamaTinggal}
                    onChange={(e) => setLamaTinggal(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden"
                  >
                    <option value="2 Hari">2 Hari</option>
                    <option value="3-5 Hari">3 - 5 Hari</option>
                    <option value="1 Minggu">1 Minggu</option>
                    <option value="2 Minggu">2 Minggu</option>
                    <option value="&gt; 1 Bulan">&gt; 1 Bulan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tanggal Kedatangan</label>
                  <input
                    type="date"
                    required
                    value={tanggalDatang}
                    onChange={(e) => setTanggalDatang(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden"
                  />
                </div>

              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">NIK KTP Tamu</label>
                <input
                  type="text"
                  required
                  maxLength={16}
                  value={nikTamu}
                  onChange={(e) => setNikTamu(e.target.value.replace(/\D/g, ''))}
                  placeholder="16 Digit NIK KTP"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Alamat Asal Daerah Tamu</label>
                <input
                  type="text"
                  required
                  value={alamatTamu}
                  onChange={(e) => setAlamatTamu(e.target.value)}
                  placeholder="Contoh: Sidoarjo, Jawa Timur"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tujuan / Alasan Kunjungan</label>
                <textarea
                  required
                  rows={2}
                  value={tujuan}
                  onChange={(e) => setTujuan(e.target.value)}
                  placeholder="Contoh: Menginap di rumah adik (Fauzi) untuk menghadiri wisuda keluarga..."
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Submit */}
              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold py-2.5 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2.5 rounded-xl transition-colors shadow-sm"
                  id="submit-guest-form"
                >
                  Daftarkan Tamu ✔️
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
