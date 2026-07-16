/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Warga, Pengumuman as PengumumanType } from '../types';
import { repository } from '../data/repository';
import { Megaphone, Plus, Calendar, Shield, Info, ArrowRight, X } from 'lucide-react';

interface PengumumanProps {
  currentUser: Warga;
  triggerRefresh: number;
  onRefresh: () => void;
}

export const Pengumuman: React.FC<PengumumanProps> = ({ currentUser, triggerRefresh, onRefresh }) => {
  const [announcements, setAnnouncements] = useState<PengumumanType[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Form fields
  const [judul, setJudul] = useState('');
  const [isi, setIsi] = useState('');
  const [kategori, setKategori] = useState<PengumumanType['kategori']>('Informasi');

  useEffect(() => {
    setAnnouncements(repository.getPengumumanList());
  }, [triggerRefresh]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    repository.createPengumuman({
      judul,
      isi,
      kategori,
    });

    setShowAddModal(false);
    setJudul('');
    setIsi('');
    onRefresh();
  };

  const isPengurus = currentUser.role === 'Pengurus';

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-slate-800 flex items-center gap-2">
            <Megaphone className="h-6 w-6 text-emerald-600" /> Papan Pengumuman Warga
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Informasi terkini, edaran RT resmi, dan himbauan keamanan lingkungan.
          </p>
        </div>

        {isPengurus && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-sm"
            id="add-announcement-button"
          >
            <Plus className="h-4 w-4" /> Buat Pengumuman
          </button>
        )}
      </div>

      {/* Main announcements cards feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {announcements.length > 0 ? (
          announcements.map((ann) => {
            const isKegiatan = ann.kategori === 'Kegiatan';
            const isKeamanan = ann.kategori === 'Keamanan';
            return (
              <div 
                key={ann.id} 
                className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 flex flex-col justify-between hover:border-slate-200 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1 ${
                      isKegiatan 
                        ? 'bg-emerald-50 text-emerald-800' 
                        : isKeamanan 
                        ? 'bg-red-50 text-red-800' 
                        : 'bg-blue-50 text-blue-800'
                    }`}>
                      {isKegiatan ? <Calendar className="h-3 w-3" /> : isKeamanan ? <Shield className="h-3 w-3" /> : <Info className="h-3 w-3" />}
                      {ann.kategori}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono font-semibold">
                      {new Date(ann.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-800 text-base leading-snug">{ann.judul}</h3>
                  <p className="text-slate-600 text-xs leading-relaxed whitespace-pre-wrap">{ann.isi}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-50 flex items-center justify-between text-[10px] text-slate-400 font-semibold font-mono">
                  <span>Diterbitkan oleh: Pengurus RT 01</span>
                  <span>ID: {ann.id}</span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-2 py-16 text-center text-slate-400 flex flex-col items-center">
            <Megaphone className="h-12 w-12 text-slate-200 mb-2" />
            <p className="font-bold text-slate-600">Belum Ada Pengumuman</p>
            <p className="text-slate-400 text-xs mt-0.5">Semua info dan edaran warga akan tampil di halaman ini.</p>
          </div>
        )}
      </div>

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowAddModal(false)} />
          
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col">
            
            <div className="bg-emerald-600 text-white px-6 py-4 flex justify-between items-center">
              <h3 className="font-bold text-base font-display">Kirim Pengumuman Baru</h3>
              <button onClick={() => setShowAddModal(false)} className="hover:bg-emerald-700 p-1 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Judul Pengumuman</label>
                <input
                  type="text"
                  required
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  placeholder="Contoh: Kerja Bakti Bulanan Bersama"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Kategori Pengumuman</label>
                <select
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden"
                >
                  <option value="Informasi">Informasi Umum / Pengumuman</option>
                  <option value="Kegiatan">Kegiatan Warga (Kerja Bakti, Rapat)</option>
                  <option value="Keamanan">Himbauan Keamanan Lingkungan</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Isi Pengumuman Lengkap</label>
                <textarea
                  required
                  rows={6}
                  value={isi}
                  onChange={(e) => setIsi(e.target.value)}
                  placeholder="Tuliskan detail pengumuman secara rinci, termasuk waktu, tempat, dan ketentuan khusus..."
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
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
                  id="publish-announcement"
                >
                  Kirim & Publikasikan
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
