/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Warga, JadwalRonda, AbsensiRonda } from '../types';
import { repository } from '../data/repository';
import { Key, Calendar, ClipboardCheck, CheckCircle, User, QrCode } from 'lucide-react';

interface RondaProps {
  currentUser: Warga;
  triggerRefresh: number;
  onRefresh: () => void;
}

export const Ronda: React.FC<RondaProps> = ({ currentUser, triggerRefresh, onRefresh }) => {
  const [jadwal, setJadwal] = useState<JadwalRonda[]>([]);
  const [absensi, setAbsensi] = useState<AbsensiRonda[]>([]);
  const [showQRModal, setShowQRModal] = useState(false);
  const [successCheckedIn, setSuccessCheckedIn] = useState(false);

  useEffect(() => {
    setJadwal(repository.getJadwalRonda());
    setAbsensi(repository.getAbsensiRonda());
  }, [triggerRefresh]);

  const handleSimulatedCheckIn = () => {
    repository.recordAbsensiRonda(currentUser.id, currentUser.nama);
    setSuccessCheckedIn(true);
    onRefresh();
    setTimeout(() => {
      setSuccessCheckedIn(false);
      setShowQRModal(false);
    }, 2500);
  };

  const todayStr = new Date().toLocaleDateString('id-ID', { weekday: 'long' });
  const todayDateStr = new Date().toISOString().substring(0, 10);

  // Check if today's ronda is already checked-in by currentUser
  const isCheckedInToday = absensi.some(
    (a) => a.tanggal === todayDateStr && a.wargaId === currentUser.id
  );

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-slate-800 flex items-center gap-2">
            <Key className="h-6 w-6 text-emerald-600" /> Jadwal Siskamling & Patroli Ronda
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Jadwal ronda bapak-bapak warga RT 01 dan sistem absensi patroli keamanan pos ronda.
          </p>
        </div>

        {currentUser.role !== 'Pengurus' && (
          <button
            onClick={() => setShowQRModal(true)}
            disabled={isCheckedInToday}
            className={`font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-sm ${
              isCheckedInToday 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
            }`}
          >
            <QrCode className="h-4 w-4" /> {isCheckedInToday ? 'Sudah Absen Ronda' : 'Absen Ronda Siskamling'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Patrol Schedules */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="h-4.5 w-4.5 text-emerald-500" /> Jadwal Siskamling Mingguan
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jadwal.map((j) => {
              const isToday = j.hari.toLowerCase() === todayStr.toLowerCase();
              return (
                <div 
                  key={j.id} 
                  className={`p-4 rounded-xl border flex flex-col justify-between gap-3 transition-colors ${
                    isToday 
                      ? 'bg-emerald-50/50 border-emerald-300 ring-1 ring-emerald-500/10' 
                      : 'bg-slate-50/50 border-slate-100'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800 text-sm tracking-tight">{j.hari}</span>
                    {isToday && (
                      <span className="bg-emerald-600 text-white font-bold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                        Hari Ini
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Petugas Jaga:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {j.petugas.map((p, idx) => (
                        <div key={idx} className="bg-white border border-slate-200/60 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1">
                          <User className="h-3 w-3 text-slate-400" /> {p.nama}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Attendance Log */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col max-h-[500px]">
          <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider flex items-center gap-1.5">
            <ClipboardCheck className="h-4.5 w-4.5 text-blue-500" /> Absen Patroli Hari Ini
          </h3>

          <div className="overflow-y-auto divide-y divide-slate-100 pr-1 flex-1">
            {absensi.length > 0 ? (
              absensi.map((abs) => (
                <div key={abs.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center">
                      ✓
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">{abs.wargaNama}</div>
                      <span className="text-slate-400 text-[10px] font-mono">{new Date(abs.tanggal).toLocaleDateString('id-ID')}</span>
                    </div>
                  </div>
                  <span className="bg-slate-100 border border-slate-200/50 text-slate-600 font-mono text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                    🕒 {abs.waktuScan} WIB
                  </span>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs">
                Belum ada absensi siskamling ronda masuk hari ini.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* SIMULATED QR CODE ABSENSI MODAL */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowQRModal(false)} />
          
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150 p-6 text-center">
            
            <h3 className="font-bold text-slate-800 text-base font-display mb-2">ABSENSI POS RONDA DIGITAL</h3>
            <p className="text-slate-500 text-xs mb-6">
              Simulasi scan QR Code yang ada di papan Pos Ronda untuk melakukan absensi kehadiran.
            </p>

            {successCheckedIn ? (
              <div className="py-8 space-y-3">
                <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                  ✓
                </div>
                <h4 className="font-bold text-emerald-600 text-base">ABSEN RONDA BERHASIL!</h4>
                <p className="text-slate-500 text-xs">Kehadiran ronda Anda pada malam ini telah terekam aman.</p>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Visual QR Code placeholder */}
                <div className="mx-auto w-40 h-40 bg-slate-100 border-4 border-emerald-500 rounded-xl p-4 flex flex-col justify-center items-center relative overflow-hidden group">
                  <div className="w-full h-full bg-[linear-gradient(45deg,#000_25%,transparent_25%),linear-gradient(-45deg,#000_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#000_75%),linear-gradient(-45deg,transparent_75%,#000_75%)] bg-[size:20px_20px] opacity-10" />
                  <QrCode className="h-20 w-20 text-slate-800 relative z-10" />
                  <div className="absolute inset-x-0 top-0 h-1 bg-emerald-500 animate-[bounce_2s_infinite] shadow-lg shadow-emerald-500" />
                </div>

                <div className="space-y-2">
                  <button
                    onClick={handleSimulatedCheckIn}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer shadow-sm"
                    id="simulate-scan-button"
                  >
                    Simulasikan Dekatkan HP ke QR Code ✔️
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowQRModal(false)}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-2 rounded-xl text-xs transition-colors"
                  >
                    Batal
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
