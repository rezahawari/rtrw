/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Warga, PanicAlert } from '../types';
import { repository } from '../data/repository';
import { ShieldAlert, Phone, AlertTriangle, CheckCircle, Clock, MapPin, Activity } from 'lucide-react';

interface DaruratProps {
  currentUser: Warga;
  triggerRefresh: number;
  onRefresh: () => void;
}

export const Darurat: React.FC<DaruratProps> = ({ currentUser, triggerRefresh, onRefresh }) => {
  const [alerts, setAlerts] = useState<PanicAlert[]>([]);

  useEffect(() => {
    setAlerts(repository.getPanicAlertList());
  }, [triggerRefresh]);

  const handleResolve = (id: string) => {
    if (confirm('Apakah situasi darurat ini telah teratasi dengan aman?')) {
      repository.updatePanicStatus(id, 'Selesai');
      onRefresh();
    }
  };

  const handleInvestigate = (id: string) => {
    repository.updatePanicStatus(id, 'Ditangani');
    onRefresh();
  };

  const isSatpamOrAdmin = currentUser.role === 'Satpam' || currentUser.role === 'Pengurus';

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold font-display text-slate-800 flex items-center gap-2">
          <ShieldAlert className="h-6 w-6 text-red-600 animate-pulse" /> Pusat Darurat & Keamanan
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Layanan darurat terpadu, daftar kontak darurat lingkungan, dan log alarm siskamling aktif.
        </p>
      </div>

      {/* Grid Layout: Active/Log alerts & Hotlines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Alerts Log Feed */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-5 shadow-xs space-y-4 max-h-[600px] overflow-y-auto">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Riwayat & Log Alarm Darurat
          </h3>

          <div className="space-y-3">
            {alerts.length > 0 ? (
              alerts.map((al) => {
                const isActive = al.status === 'Aktif';
                const isInvestigating = al.status === 'Ditangani';
                return (
                  <div 
                    key={al.id} 
                    className={`p-4 rounded-xl border flex flex-col justify-between gap-3 ${
                      isActive 
                        ? 'bg-red-50/70 border-red-200 animate-pulse' 
                        : isInvestigating 
                        ? 'bg-amber-50/70 border-amber-200' 
                        : 'bg-slate-50/50 border-slate-100'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            isActive ? 'bg-red-600 text-white' :
                            isInvestigating ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {al.jenisDarurat}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">ID: {al.id}</span>
                        </div>
                        <h4 className="font-bold text-slate-800 text-sm mt-1.5">{al.wargaNama}</h4>
                        <div className="text-xs text-slate-500 mt-1 space-y-1">
                          <p className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> Lokasi: <span className="font-semibold text-slate-700">{al.lokasiManual}</span></p>
                          <p className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> Kontak: {al.noHp}</p>
                        </div>
                      </div>

                      <div className="text-right sm:text-left">
                        <span className="text-[10px] text-slate-400 font-mono font-semibold block">
                          {new Date(al.createdAt).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                        </span>
                        
                        {/* Status text */}
                        <span className={`inline-flex items-center gap-0.5 text-[9px] font-bold uppercase px-2 py-0.5 rounded mt-1.5 ${
                          isActive ? 'bg-red-100 text-red-800' :
                          isInvestigating ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {isActive && <Clock className="h-3 w-3 animate-spin" />}
                          {isInvestigating && <Activity className="h-3 w-3" />}
                          {al.status}
                        </span>
                      </div>
                    </div>

                    {al.keterangan && (
                      <p className="text-slate-600 text-xs italic bg-white/70 p-2.5 rounded-lg border border-slate-100">
                        "{al.keterangan}"
                      </p>
                    )}

                    {/* Controls */}
                    {isSatpamOrAdmin && al.status !== 'Selesai' && (
                      <div className="flex gap-2 pt-1 border-t border-slate-100/50">
                        {isActive && (
                          <button
                            onClick={() => handleInvestigate(al.id)}
                            className="flex-1 bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-bold py-1.5 rounded-lg transition-colors"
                          >
                            Mulai Tangani 🕒
                          </button>
                        )}
                        <button
                          onClick={() => handleResolve(al.id)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white text-[10px] font-bold py-1.5 rounded-lg transition-colors"
                        >
                          Selesaikan ✔️
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center text-slate-400">
                Belum ada alarm atau log darurat yang tercatat.
              </div>
            )}
          </div>
        </div>

        {/* Emergency Hotlines Contacts */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs space-y-4 h-fit">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            📞 Kontak Darurat Utama (112)
          </h3>

          <div className="space-y-2.5">
            {[
              { nama: 'Layanan Ambulans / Medis', nomor: '118 / 119', desk: 'Penanganan gawat darurat medis cepat' },
              { nama: 'Dinas Pemadam Kebakaran', nomor: '113', desk: 'Gawat darurat kebakaran & penyelematan' },
              { nama: 'Kepolisian Sektor Menteng', nomor: '021-3141234', desk: 'Pelaporan tindakan kriminalitas' },
              { nama: 'Bantuan Darurat Nasional', nomor: '112', desk: 'Layanan bebas pulsa darurat seluler' },
              { nama: 'Pos Keamanan (Satpam RT)', nomor: '081122334455', desk: 'Petugas piket pos ronda melati' }
            ].map((cnt, i) => (
              <div key={i} className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                <div className="flex justify-between items-start gap-2">
                  <span className="font-bold text-slate-800 text-xs">{cnt.nama}</span>
                  <a 
                    href={`tel:${cnt.nomor.replace(/[\s-]/g, '')}`} 
                    className="bg-red-50 text-red-700 hover:bg-red-100 font-bold px-2.5 py-1 rounded-lg text-[10px] font-mono flex items-center gap-1 transition-colors flex-shrink-0"
                  >
                    <Phone className="h-3 w-3" /> {cnt.nomor}
                  </a>
                </div>
                <p className="text-[10px] text-slate-400">{cnt.desk}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
