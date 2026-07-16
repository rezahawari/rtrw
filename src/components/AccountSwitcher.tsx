/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Warga } from '../types';
import { repository } from '../data/repository';
import { Shield, User, UserCheck, Key, Home, HelpCircle } from 'lucide-react';

interface AccountSwitcherProps {
  onLogin: (user: Warga) => void;
}

export const AccountSwitcher: React.FC<AccountSwitcherProps> = ({ onLogin }) => {
  const wargaList = repository.getWargaList();
  const [selectedRole, setSelectedRole] = useState<'All' | 'Pengurus' | 'Warga' | 'Satpam'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = wargaList.filter((w) => {
    const matchesRole = selectedRole === 'All' || w.role === selectedRole;
    const matchesSearch = w.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          w.nik.includes(searchQuery) ||
                          w.alamat.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const handleSelectUser = (u: Warga) => {
    repository.setCurrentUser(u.id);
    onLogin(u);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white text-center">
          <div className="inline-flex p-3 bg-white/10 rounded-full mb-3 backdrop-blur-xs">
            <Home className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold font-display tracking-tight">RT/RW Digital</h1>
          <p className="text-emerald-100 text-sm mt-1">Sistem Administrasi & Informasi Warga RT 01/RW 05</p>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto flex flex-col">
          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Pilih Role Simulasi
            </label>
            <div className="grid grid-cols-4 gap-1.5 bg-slate-100 p-1 rounded-lg">
              {(['All', 'Pengurus', 'Warga', 'Satpam'] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`py-2 px-1 text-xs font-medium rounded-md transition-all ${
                    selectedRole === role
                      ? 'bg-white text-emerald-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {role === 'All' ? 'Semua' : role}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Cari nama warga / alamat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-slate-50"
            />
          </div>

          {/* User List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[220px]">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u) => {
                const isPengurus = u.role === 'Pengurus';
                const isSatpam = u.role === 'Satpam';
                return (
                  <button
                    key={u.id}
                    onClick={() => handleSelectUser(u)}
                    className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all flex items-center justify-between group"
                    id={`login-user-${u.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        isPengurus 
                          ? 'bg-amber-100 text-amber-700' 
                          : isSatpam 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {isPengurus ? (
                          <Shield className="h-5 w-5" />
                        ) : isSatpam ? (
                          <Key className="h-5 w-5" />
                        ) : (
                          <User className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 text-sm group-hover:text-emerald-700 transition-colors">
                          {u.nama}
                        </div>
                        <div className="text-slate-500 text-xs mt-0.5">
                          {u.alamat}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-[10px] px-2 py-0.5 font-semibold rounded-full ${
                        isPengurus 
                          ? 'bg-amber-100 text-amber-800' 
                          : isSatpam 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {u.role === 'Pengurus' ? 'Pengurus RT' : u.role}
                      </span>
                      {u.id === 'W-01' && (
                        <span className="text-[9px] text-slate-400 font-medium">Ketua RT</span>
                      )}
                      {u.id === 'W-02' && (
                        <span className="text-[9px] text-slate-400 font-medium">Bendahara</span>
                      )}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="py-8 text-center text-slate-400 flex flex-col items-center">
                <HelpCircle className="h-8 w-8 text-slate-300 mb-2" />
                <p className="text-sm">Tidak ada warga yang cocok</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="bg-slate-50 p-4 border-t border-slate-100 text-center text-xs text-slate-500">
          <p className="font-medium text-slate-600">💡 Petunjuk Demo:</p>
          <p className="mt-1 leading-relaxed">
            Pilih <b>Bambang (Pengurus)</b> untuk menu kelola warga/kas. Pilih <b>Budi / Siti (Warga)</b> untuk mengajukan surat, belanja UMKM, atau memicu Panic Button.
          </p>
        </div>
      </div>
    </div>
  );
};
