/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Warga, Fasilitas as FasilitasType, BookingFasilitas } from '../types';
import { repository } from '../data/repository';
import { Landmark, Plus, Calendar, Clock, Lock, CheckCircle, X, Trash2, ShieldAlert } from 'lucide-react';

interface FasilitasProps {
  currentUser: Warga;
  triggerRefresh: number;
  onRefresh: () => void;
}

export const Fasilitas: React.FC<FasilitasProps> = ({ currentUser, triggerRefresh, onRefresh }) => {
  const [facilities, setFacilities] = useState<FasilitasType[]>([]);
  const [bookings, setBookings] = useState<BookingFasilitas[]>([]);
  const [showBookModal, setShowBookModal] = useState(false);

  // Form fields
  const [selectedFacilityId, setSelectedFacilityId] = useState('');
  const [tanggal, setTanggal] = useState(new Date().toISOString().substring(0, 10));
  const [jamMulai, setJamMulai] = useState('08:00');
  const [jamSelesai, setJamSelesai] = useState('12:00');
  const [keperluan, setKeperluan] = useState('');

  useEffect(() => {
    setFacilities(repository.getFasilitasList());
    setBookings(repository.getBookingList());
  }, [triggerRefresh]);

  // Handle setting initial facility in modal
  const handleOpenBookModal = (facId?: string) => {
    setSelectedFacilityId(facId || (facilities[0]?.id || ''));
    setShowBookModal(true);
  };

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();

    const startMinutes = parseInt(jamMulai.split(':')[0]) * 60 + parseInt(jamMulai.split(':')[1]);
    const endMinutes = parseInt(jamSelesai.split(':')[0]) * 60 + parseInt(jamSelesai.split(':')[1]);

    if (startMinutes >= endMinutes) {
      alert('Jam selesai harus lebih besar dari jam mulai.');
      return;
    }

    // Overlap validation check
    const overlapping = bookings.find((b) => {
      if (b.fasilitasId !== selectedFacilityId || b.tanggalMulai !== tanggal) return false;
      if (b.status === 'Ditolak') return false;
      
      const bStart = parseInt(b.jamMulai.split(':')[0]) * 60 + parseInt(b.jamMulai.split(':')[1]);
      const bEnd = parseInt(b.jamSelesai.split(':')[0]) * 60 + parseInt(b.jamSelesai.split(':')[1]);

      // Overlap formula: (start1 < end2) && (start2 < end1)
      return (startMinutes < bEnd) && (bStart < endMinutes);
    });

    if (overlapping) {
      alert(`Gagal memboking! Waktu bentrok dengan pemesanan oleh "${overlapping.wargaNama}" untuk keperluan "${overlapping.keperluan}" pada pukul ${overlapping.jamMulai} - ${overlapping.jamSelesai} WIB.`);
      return;
    }

    const fac = facilities.find((f) => f.id === selectedFacilityId);

    repository.createBooking({
      fasilitasId: selectedFacilityId,
      fasilitasNama: fac?.nama || 'Fasilitas RT',
      tanggalMulai: tanggal,
      tanggalSelesai: tanggal,
      jamMulai,
      jamSelesai,
      keperluan,
      wargaId: currentUser.id,
      wargaNama: currentUser.nama,
    });

    setShowBookModal(false);
    setKeperluan('');
    onRefresh();
  };

  const handleDeleteBooking = (id: string) => {
    if (confirm('Apakah Anda ingin membatalkan pemesanan fasilitas ini?')) {
      repository.updateBookingStatus(id, 'Ditolak');
      onRefresh();
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-slate-800 flex items-center gap-2">
            <Landmark className="h-6 w-6 text-emerald-600" /> Peminjaman Inventaris & Fasilitas RT
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Sistem peminjaman transparan Balai Warga, lapangan bulu tangkis, kursi pesta, tenda RT, dan alat sound system.
          </p>
        </div>

        <button
          onClick={() => handleOpenBookModal()}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-sm"
          id="add-booking-button"
        >
          <Plus className="h-4 w-4" /> Boking Sarana
        </button>
      </div>

      {/* Grid Layout: Facilities Catalogs & Reservation History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Facilities Catalog */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Katalog Inventaris RT
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {facilities.map((fac) => (
              <div key={fac.id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col justify-between hover:border-slate-200 transition-colors">
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-800 text-sm md:text-base">{fac.nama}</h4>
                  <p className="text-slate-500 text-xs leading-relaxed">"{fac.deskripsi}"</p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-50 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Status: <span className="text-emerald-700">Tersedia</span>
                  </span>
                  
                  <button
                    onClick={() => handleOpenBookModal(fac.id)}
                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold py-1.5 px-3.5 rounded-lg text-[10px] transition-colors"
                  >
                    Pesan Sarana
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bookings Queue */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col max-h-[500px]">
          <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="h-4.5 w-4.5 text-blue-500" /> Agenda Penggunaan Sarana
          </h3>

          <div className="overflow-y-auto divide-y divide-slate-100 pr-1 flex-1">
            {bookings.length > 0 ? (
              bookings.map((b) => {
                const isMyBooking = b.wargaId === currentUser.id;
                const isRejected = b.status === 'Ditolak';
                return (
                  <div key={b.id} className={`py-3.5 space-y-2 text-xs ${isRejected ? 'opacity-50' : ''}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-slate-800 block leading-tight">{b.fasilitasNama}</span>
                        <span className="text-slate-400 text-[10px] font-mono mt-0.5">Pemesan: {b.wargaNama}</span>
                      </div>

                      {isMyBooking && !isRejected && (
                        <button
                          onClick={() => handleDeleteBooking(b.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors flex-shrink-0"
                          title="Batalkan Pemesanan"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-500 font-semibold font-mono text-[10px] uppercase">
                      <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-slate-300" /> {new Date(b.tanggalMulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-slate-300" /> {b.jamMulai} - {b.jamSelesai} WIB</span>
                    </div>

                    <p className="text-slate-600 text-[11px] bg-slate-50 border border-slate-100 p-2 rounded-lg italic">
                      "Keperluan: {b.keperluan}"
                    </p>

                    <div className="flex justify-between items-center text-[9px] font-bold">
                      <span className={`px-1.5 py-0.5 rounded uppercase ${
                        b.status === 'Disetujui' ? 'bg-green-100 text-green-800' :
                        b.status === 'Ditolak' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {b.status}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs">
                Belum ada jadwal penggunaan fasilitas mendatang.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* BOOK MODAL */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowBookModal(false)} />
          
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col">
            
            <div className="bg-emerald-600 text-white px-6 py-4 flex justify-between items-center">
              <h3 className="font-bold text-base font-display">Boking Fasilitas / Inventaris</h3>
              <button onClick={() => setShowBookModal(false)} className="hover:bg-emerald-700 p-1 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="p-6 space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Pilih Fasilitas / Inventaris</label>
                <select
                  value={selectedFacilityId}
                  onChange={(e) => setSelectedFacilityId(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  {facilities.map((fac) => (
                    <option key={fac.id} value={fac.id}>
                      {fac.nama}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tanggal Peminjaman</label>
                <input
                  type="date"
                  required
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Jam Mulai</label>
                  <input
                    type="time"
                    required
                    value={jamMulai}
                    onChange={(e) => setJamMulai(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Jam Selesai</label>
                  <input
                    type="time"
                    required
                    value={jamSelesai}
                    onChange={(e) => setJamSelesai(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden"
                  />
                </div>

              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Keperluan Acara / Deskripsi</label>
                <textarea
                  required
                  rows={3}
                  value={keperluan}
                  onChange={(e) => setKeperluan(e.target.value)}
                  placeholder="Contoh: Rapat kerja panitia pemilu siskamling..."
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Overlap notification info */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/50 flex gap-2 text-[11px] text-amber-800">
                <ShieldAlert className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Sistem otomatis menolak pemesanan pada tanggal & jam yang sama jika terdeteksi bentrok waktu penggunaan.
                </p>
              </div>

              {/* Submit */}
              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold py-2.5 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2.5 rounded-xl transition-colors shadow-sm"
                  id="submit-booking"
                >
                  Konfirmasi Sarana ✔️
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
