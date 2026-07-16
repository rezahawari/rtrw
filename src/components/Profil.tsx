/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Warga } from '../types';
import { repository } from '../data/repository';
import { User, Settings, Shield, RefreshCw, Smartphone, MapPin, Database, Sparkles } from 'lucide-react';

interface ProfilProps {
  currentUser: Warga;
  onUserChange: (user: Warga) => void;
  triggerRefresh: number;
  onRefresh: () => void;
}

export const Profil: React.FC<ProfilProps> = ({ currentUser, onUserChange, triggerRefresh, onRefresh }) => {
  
  const handleResetData = () => {
    if (confirm('Apakah Anda yakin ingin menyetel ulang database simulasi ke kondisi bawaan awal? Semua data baru yang Anda buat akan dihapus.')) {
      repository.resetDemoData();
      onRefresh();
      
      // Update the active user state in the parent
      const reseededWarga = repository.getWargaList();
      const currentRoleUser = reseededWarga.find((w) => w.role === currentUser.role);
      if (currentRoleUser) {
        onUserChange(currentRoleUser);
      } else if (reseededWarga.length > 0) {
        onUserChange(reseededWarga[0]);
      }
      
      alert('Database berhasil direset ke kondisi bawaan awal dengan data simulasi baru!');
    }
  };

  const allWarga = repository.getWargaList();

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold font-display text-slate-800 flex items-center gap-2">
          <Settings className="h-6 w-6 text-emerald-600" /> Profil Pengguna & Pengaturan Simulasi
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Informasi akun warga aktif, kontrol simulasi pergantian identitas, dan pemulihan data sistem.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-display text-2xl font-bold border-2 border-emerald-500">
              {currentUser.nama.substring(0, 2).toUpperCase()}
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-slate-800 text-base md:text-lg leading-tight">{currentUser.nama}</h3>
                <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  currentUser.role === 'Pengurus' ? 'bg-indigo-100 text-indigo-800' :
                  currentUser.role === 'Satpam' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium font-mono">No. KK: {currentUser.noKk} • NIK: {currentUser.nik}</p>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Citizen Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-xs">
            <div className="space-y-1">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">No. Rumah</span>
              <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                <MapPin className="h-4 w-4 text-slate-300" /> No. {currentUser.noRumah}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">Nomor HP</span>
              <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                <Smartphone className="h-4 w-4 text-slate-300" /> {currentUser.noHp}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">Status Tempat Tinggal</span>
              <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                <User className="h-4 w-4 text-slate-300" /> {currentUser.statusTinggal}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">Pekerjaan</span>
              <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                <Shield className="h-4 w-4 text-slate-300" /> {currentUser.pekerjaan || '-'}
              </div>
            </div>
          </div>
        </div>

        {/* Simulasi & Reset Settings Card */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs space-y-6">
          <div>
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-4.5 w-4.5 text-emerald-500 animate-pulse" /> Sandbox Simulasi
            </h3>
            <p className="text-slate-400 text-[11px] mt-0.5">
              RT/RW Digital berjalan offline (LocalStorage). Anda dapat mengganti login warga untuk melihat menu dari sudut pandang peran lainnya.
            </p>
          </div>

          <div className="space-y-3">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">Pilih Warga untuk Simulasi Login:</span>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {allWarga.map((w) => (
                <button
                  key={w.id}
                  onClick={() => onUserChange(w)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs font-semibold flex justify-between items-center transition-all cursor-pointer ${
                    currentUser.id === w.id 
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                      : 'bg-slate-50 border-slate-100 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span>{w.nama}</span>
                  <span className="text-[10px] text-slate-400">{w.role}</span>
                </button>
              ))}
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Danger zone / Reset Demo Data */}
          <div className="space-y-2 pt-2">
            <span className="text-rose-500 font-bold uppercase tracking-wider text-[10px] block flex items-center gap-1">
              <Database className="h-3.5 w-3.5" /> Zona Pemulihan Sistem
            </span>
            <button
              onClick={handleResetData}
              className="w-full bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              id="reset-demo-data-button"
            >
              <RefreshCw className="h-4 w-4 animate-spin-slow" /> Reset Semua Data Demo
            </button>
            <p className="text-[10px] text-slate-400 text-center">
              Mengembalikan seluruh iuran, surat, pengumuman, pengaduan, polling, dan log ke data sampel bawaan awal.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
