/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Warga, KalenderKegiatan } from '../types';
import { repository } from '../data/repository';
import { Calendar, Plus, Clock, MapPin, Users, X, Check, XSquare } from 'lucide-react';

interface KalenderProps {
  currentUser: Warga;
  triggerRefresh: number;
  onRefresh: () => void;
}

export const Kalender: React.FC<KalenderProps> = ({ currentUser, triggerRefresh, onRefresh }) => {
  const [events, setEvents] = useState<KalenderKegiatan[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Form fields
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [waktu, setWaktu] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [kategori, setKategori] = useState<KalenderKegiatan['kategori']>('Kerja Bakti');

  useEffect(() => {
    // Sort events by date ascending
    const sorted = repository.getEventList().sort(
      (a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime()
    );
    setEvents(sorted);
  }, [triggerRefresh]);

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    repository.createEvent({
      judul,
      deskripsi,
      tanggal,
      waktu,
      lokasi,
      kategori,
    });

    setShowAddModal(false);
    setJudul('');
    setDeskripsi('');
    setTanggal('');
    setWaktu('');
    setLokasi('');
    onRefresh();
  };

  const handleRSVP = (eventId: string, status: 'Hadir' | 'Absen') => {
    repository.rsvpEvent(eventId, currentUser.id, currentUser.nama, status);
    onRefresh();
  };

  const isPengurus = currentUser.role === 'Pengurus';

  return (
    <div className="space-y-6">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-slate-800 flex items-center gap-2">
            <Calendar className="h-6 w-6 text-emerald-600" /> Agenda & Kalender Kegiatan RT
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Pantau rapat bulanan, jadwal posyandu balita, kerja bakti, dan siskamling lingkungan.
          </p>
        </div>

        {isPengurus && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-sm"
            id="add-event-button"
          >
            <Plus className="h-4 w-4" /> Tambah Kegiatan
          </button>
        )}
      </div>

      {/* Agenda list */}
      <div className="space-y-4">
        {events.length > 0 ? (
          events.map((evt) => {
            const hasRSVPed = evt.rsvp.find((r) => r.wargaId === currentUser.id);
            const rsvpHadirCount = evt.rsvp.filter((r) => r.status === 'Hadir').length;
            const rsvpAbsenCount = evt.rsvp.filter((r) => r.status === 'Absen').length;

            return (
              <div 
                key={evt.id} 
                className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 md:p-6 flex flex-col md:flex-row gap-5 items-start justify-between hover:border-slate-200 transition-colors"
              >
                {/* Event core info */}
                <div className="flex gap-4 items-start flex-1">
                  {/* Calendar Badge */}
                  <div className="bg-emerald-600 text-white rounded-2xl p-3 flex flex-col items-center justify-center w-16 h-16 flex-shrink-0 text-center font-display shadow-sm shadow-emerald-600/10">
                    <span className="text-[10px] font-bold uppercase leading-none">JUL</span>
                    <span className="text-2xl font-bold leading-none mt-1.5">{evt.tanggal.split('-')[2]}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-emerald-50 text-emerald-800">
                        {evt.kategori}
                      </span>
                      <span className="text-slate-300 text-xs">•</span>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Clock className="h-3.5 w-3.5" /> <span>{evt.waktu} WIB</span>
                      </div>
                      <span className="text-slate-300 text-xs">•</span>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <MapPin className="h-3.5 w-3.5 text-slate-300" /> <span>{evt.lokasi}</span>
                      </div>
                    </div>

                    <h3 className="font-bold text-slate-800 text-base leading-tight">{evt.judul}</h3>
                    <p className="text-slate-500 text-xs leading-relaxed max-w-xl">{evt.deskripsi}</p>
                    
                    {/* RSVP summary */}
                    <div className="flex items-center gap-4 text-[11px] text-slate-500 font-medium bg-slate-50 p-2 rounded-xl w-fit">
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5 text-emerald-500" /> Warga RSVP:
                      </span>
                      <span className="text-emerald-700 font-bold">{rsvpHadirCount} Hadir</span>
                      <span>•</span>
                      <span className="text-rose-600 font-semibold">{rsvpAbsenCount} Absen</span>
                    </div>
                  </div>
                </div>

                {/* RSVP Interaction Buttons */}
                {currentUser.role === 'Warga' && (
                  <div className="flex flex-col gap-2 w-full md:w-44 text-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Konfirmasi Kehadiran</span>
                    
                    {hasRSVPed ? (
                      <div className="space-y-2">
                        <div className={`py-1.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 ${
                          hasRSVPed.status === 'Hadir' 
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                            : 'bg-red-50 border-red-200 text-red-800'
                        }`}>
                          {hasRSVPed.status === 'Hadir' ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                          Anda menyatakan: {hasRSVPed.status}
                        </div>
                        <button
                          onClick={() => handleRSVP(evt.id, hasRSVPed.status === 'Hadir' ? 'Absen' : 'Hadir')}
                          className="text-[10px] font-semibold text-slate-400 hover:text-slate-700 underline"
                        >
                          Ubah Pilihan
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleRSVP(evt.id, 'Absen')}
                          className="flex-1 border border-red-200 hover:bg-red-50 text-red-700 font-bold py-2 rounded-xl text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <X className="h-3.5 w-3.5" /> Absen
                        </button>
                        <button
                          onClick={() => handleRSVP(evt.id, 'Hadir')}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                        >
                          <Check className="h-3.5 w-3.5" /> Hadir
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="py-16 text-center text-slate-400 flex flex-col items-center">
            <Calendar className="h-12 w-12 text-slate-200 mb-2" />
            <p className="font-bold text-slate-600">Belum Ada Agenda</p>
            <p className="text-slate-400 text-xs mt-0.5">Jadwal kegiatan atau siskamling mendatang akan tampil di sini.</p>
          </div>
        )}
      </div>

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowAddModal(false)} />
          
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col">
            
            <div className="bg-emerald-600 text-white px-6 py-4 flex justify-between items-center">
              <h3 className="font-bold text-base font-display">Tambah Agenda Kegiatan</h3>
              <button onClick={() => setShowAddModal(false)} className="hover:bg-emerald-700 p-1 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="p-6 space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nama Kegiatan (Judul)</label>
                <input
                  type="text"
                  required
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  placeholder="Contoh: Rapat Koordinasi Posyandu"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tanggal Kegiatan</label>
                  <input
                    type="date"
                    required
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Waktu Mulai (WIB)</label>
                  <input
                    type="time"
                    required
                    value={waktu}
                    onChange={(e) => setWaktu(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden"
                  />
                </div>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Lokasi Tempat</label>
                  <input
                    type="text"
                    required
                    value={lokasi}
                    onChange={(e) => setLokasi(e.target.value)}
                    placeholder="Contoh: Balai Warga RT 01"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Kategori</label>
                  <select
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden"
                  >
                    <option value="Kerja Bakti">Kerja Bakti</option>
                    <option value="Rapat">Rapat Warga</option>
                    <option value="Posyandu">Posyandu Balita/Lansia</option>
                    <option value="Ronda">Ronda Siskamling</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Deskripsi Singkat</label>
                <textarea
                  required
                  rows={3}
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  placeholder="Beri keterangan rincian agenda acara..."
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Submit */}
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
                  id="submit-event"
                >
                  Simpan Agenda
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
