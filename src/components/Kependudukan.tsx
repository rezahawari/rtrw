/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Warga, Role } from '../types';
import { repository } from '../data/repository';
import { Users, Search, Plus, Filter, Edit, Trash2, Shield, User, Key, Eye, Check, X } from 'lucide-react';

interface KependudukanProps {
  currentUser: Warga;
  triggerRefresh: number;
  onRefresh: () => void;
}

export const Kependudukan: React.FC<KependudukanProps> = ({ currentUser, triggerRefresh, onRefresh }) => {
  const [wargaList, setWargaList] = useState<Warga[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Tetap' | 'Kontrak'>('All');
  const [filterRole, setFilterRole] = useState<'All' | 'Pengurus' | 'Warga' | 'Satpam'>('All');
  
  // Modal state
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingWarga, setEditingWarga] = useState<Warga | null>(null);
  
  // Form fields
  const [nama, setNama] = useState('');
  const [nik, setNik] = useState('');
  const [noHp, setNoHp] = useState('');
  const [alamat, setAlamat] = useState('');
  const [statusTinggal, setStatusTinggal] = useState<'Tetap' | 'Kontrak'>('Tetap');
  const [statusPekerjaan, setStatusPekerjaan] = useState('');
  const [role, setRole] = useState<Role>('Warga');
  const [rt, setRt] = useState('01');
  const [rw, setRw] = useState('05');

  // Detail view state
  const [selectedWarga, setSelectedWarga] = useState<Warga | null>(null);

  useEffect(() => {
    setWargaList(repository.getWargaList());
  }, [triggerRefresh]);

  const openAddModal = () => {
    setEditingWarga(null);
    setNama('');
    setNik('');
    setNoHp('');
    setAlamat('');
    setStatusTinggal('Tetap');
    setStatusPekerjaan('');
    setRole('Warga');
    setRt('01');
    setRw('05');
    setShowFormModal(true);
  };

  const openEditModal = (w: Warga) => {
    setEditingWarga(w);
    setNama(w.nama);
    setNik(w.nik);
    setNoHp(w.noHp);
    setAlamat(w.alamat);
    setStatusTinggal(w.statusTinggal);
    setStatusPekerjaan(w.statusPekerjaan);
    setRole(w.role);
    setRt(w.rt);
    setRw(w.rw);
    setShowFormModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (nik.length !== 16) {
      alert('NIK harus berupa 16 digit angka.');
      return;
    }

    if (editingWarga) {
      // Update
      repository.updateWarga(editingWarga.id, {
        nama,
        nik,
        noHp,
        alamat,
        statusTinggal,
        statusPekerjaan,
        role,
        rt,
        rw,
      });
    } else {
      // Create
      repository.createWarga({
        nama,
        nik,
        noHp,
        alamat,
        statusTinggal,
        statusPekerjaan,
        role,
        rt,
        rw,
      });
    }

    setShowFormModal(false);
    onRefresh();
  };

  const handleDelete = (id: string, nama: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus warga ${nama}? Semua tagihan iuran terkait juga akan dihapus.`)) {
      repository.deleteWarga(id);
      onRefresh();
      if (selectedWarga?.id === id) {
        setSelectedWarga(null);
      }
    }
  };

  // Filter logic
  const filteredList = wargaList.filter((w) => {
    const matchesSearch = w.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          w.nik.includes(searchQuery) ||
                          w.alamat.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || w.statusTinggal === filterStatus;
    const matchesRole = filterRole === 'All' || w.role === filterRole;

    return matchesSearch && matchesStatus && matchesRole;
  });

  const isPengurus = currentUser.role === 'Pengurus';

  return (
    <div className="space-y-6">
      
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-slate-800 flex items-center gap-2">
            <Users className="h-6 w-6 text-emerald-600" /> Administrasi Kependudukan
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Kelola data dan profil warga RT 01/RW 05 secara terpadu.
          </p>
        </div>

        {isPengurus && (
          <button
            onClick={openAddModal}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-sm shadow-emerald-600/10"
            id="add-warga-button"
          >
            <Plus className="h-4 w-4" /> Tambah Warga
          </button>
        )}
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          
          {/* Search bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama warga, NIK, alamat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-sm bg-slate-50"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200/50">
            <span className="text-xs font-semibold text-slate-500 px-2 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Status Tinggal:
            </span>
            {(['All', 'Tetap', 'Kontrak'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                  filterStatus === s
                    ? 'bg-white text-emerald-700 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {s === 'All' ? 'Semua' : s}
              </button>
            ))}
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200/50">
            <span className="text-xs font-semibold text-slate-500 px-2 flex items-center gap-1">
              <Shield className="h-3 w-3" /> Hak Akses:
            </span>
            {(['All', 'Pengurus', 'Warga', 'Satpam'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setFilterRole(r)}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                  filterRole === r
                    ? 'bg-white text-emerald-700 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {r === 'All' ? 'Semua' : r}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Citizen List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-xs p-4 flex flex-col max-h-[600px] overflow-hidden">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold text-slate-800">Daftar Warga ({filteredList.length})</h3>
            <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-full">
              RT 01 / RW 05
            </span>
          </div>

          <div className="overflow-y-auto divide-y divide-slate-100 flex-1 pr-1">
            {filteredList.length > 0 ? (
              filteredList.map((w) => {
                const isUserPengurus = w.role === 'Pengurus';
                const isUserSatpam = w.role === 'Satpam';
                return (
                  <div
                    key={w.id}
                    className={`py-3 flex items-center justify-between group transition-colors px-2 rounded-xl border border-transparent ${
                      selectedWarga?.id === w.id 
                        ? 'bg-emerald-50/40 border-emerald-100' 
                        : 'hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      
                      {/* Avatar Icon */}
                      <div className={`p-2.5 rounded-xl flex-shrink-0 ${
                        isUserPengurus 
                          ? 'bg-amber-50 text-amber-600' 
                          : isUserSatpam 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {isUserPengurus ? (
                          <Shield className="h-5 w-5" />
                        ) : isUserSatpam ? (
                          <Key className="h-5 w-5" />
                        ) : (
                          <User className="h-5 w-5" />
                        )}
                      </div>

                      <div>
                        <div className="font-bold text-slate-800 text-sm">{w.nama}</div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                          <span className="font-mono text-[11px]">{w.nik}</span>
                          <span>•</span>
                          <span>{w.statusTinggal}</span>
                        </div>
                      </div>

                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setSelectedWarga(w)}
                        className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Lihat Detail"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      
                      {isPengurus && (
                        <>
                          <button
                            onClick={() => openEditModal(w)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(w.id, w.nama)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center text-slate-400">
                Tidak ada data warga yang cocok.
              </div>
            )}
          </div>
        </div>

        {/* Detailed Profile View */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 flex flex-col h-fit">
          {selectedWarga ? (
            <div className="space-y-5">
              
              {/* Header profile */}
              <div className="text-center pb-4 border-b border-slate-100">
                <div className={`mx-auto h-16 w-16 rounded-full flex items-center justify-center text-white font-bold text-xl ${
                  selectedWarga.role === 'Pengurus' ? 'bg-amber-500' :
                  selectedWarga.role === 'Satpam' ? 'bg-blue-500' : 'bg-emerald-500'
                }`}>
                  {selectedWarga.nama.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                </div>
                <h4 className="font-bold text-slate-800 text-base mt-3">{selectedWarga.nama}</h4>
                <p className="text-slate-400 text-xs font-mono mt-0.5">{selectedWarga.nik}</p>
                <span className={`inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full mt-2 ${
                  selectedWarga.role === 'Pengurus' ? 'bg-amber-100 text-amber-800' :
                  selectedWarga.role === 'Satpam' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {selectedWarga.role === 'Pengurus' ? 'Pengurus RT' : selectedWarga.role}
                </span>
              </div>

              {/* Data fields */}
              <div className="space-y-3.5 text-xs">
                
                <div>
                  <span className="text-slate-400 font-semibold uppercase tracking-wider block">No. HP / WhatsApp</span>
                  <a 
                    href={`https://wa.me/${selectedWarga.noHp.replace(/^0/, '62')}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="font-semibold text-slate-700 hover:text-emerald-600 transition-colors mt-0.5 block underline"
                  >
                    {selectedWarga.noHp}
                  </a>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold uppercase tracking-wider block">Alamat</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">{selectedWarga.alamat}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400 font-semibold uppercase tracking-wider block">Status Tinggal</span>
                    <span className="font-semibold text-slate-800 mt-0.5 block">{selectedWarga.statusTinggal}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold uppercase tracking-wider block">Blok RT/RW</span>
                    <span className="font-semibold text-slate-800 mt-0.5 block">RT {selectedWarga.rt} / RW {selectedWarga.rw}</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold uppercase tracking-wider block">Pekerjaan</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">{selectedWarga.statusPekerjaan || '-'}</span>
                </div>

                <div className="pt-3 border-t border-slate-100 text-[10px] text-slate-400">
                  <p>Mulai Terdaftar: {new Date(selectedWarga.createdAt).toLocaleDateString('id-ID')}</p>
                </div>

              </div>

            </div>
          ) : (
            <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center">
              <Users className="h-10 w-10 text-slate-200 mb-2" />
              <p className="font-bold text-slate-600 text-sm">Pilih Warga</p>
              <p className="text-slate-400 text-xs mt-0.5 max-w-[200px]">Klik ikon mata di daftar warga untuk melihat profil kependudukan lengkap.</p>
            </div>
          )}
        </div>

      </div>

      {/* FORM MODAL (Add / Edit) */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowFormModal(false)} />
          
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
            
            <div className="bg-emerald-600 text-white px-6 py-4 flex justify-between items-center">
              <h3 className="font-bold text-base font-display">
                {editingWarga ? 'Edit Data Warga' : 'Tambah Warga Baru'}
              </h3>
              <button onClick={() => setShowFormModal(false)} className="hover:bg-emerald-700 p-1.5 rounded-lg transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">NIK (KTP)</label>
                  <input
                    type="text"
                    required
                    maxLength={16}
                    value={nik}
                    onChange={(e) => setNik(e.target.value.replace(/\D/g, ''))}
                    placeholder="16 Digit NIK"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">No. HP / WhatsApp</label>
                  <input
                    type="tel"
                    required
                    value={noHp}
                    onChange={(e) => setNoHp(e.target.value.replace(/[^\d+]/g, ''))}
                    placeholder="Contoh: 0812345678"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Pekerjaan</label>
                  <input
                    type="text"
                    required
                    value={statusPekerjaan}
                    onChange={(e) => setStatusPekerjaan(e.target.value)}
                    placeholder="Contoh: PNS, Wiraswasta, Ojek, dll"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Alamat Lengkap</label>
                <input
                  type="text"
                  required
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  placeholder="Contoh: Jl. Melati No. 05"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Status Tinggal</label>
                  <select
                    value={statusTinggal}
                    onChange={(e) => setStatusTinggal(e.target.value as 'Tetap' | 'Kontrak')}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Tetap">Tetap (KTP Setempat)</option>
                    <option value="Kontrak">Kontrak / Sewa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">RT</label>
                  <input
                    type="text"
                    required
                    value={rt}
                    onChange={(e) => setRt(e.target.value.substring(0, 2))}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">RW</label>
                  <input
                    type="text"
                    required
                    value={rw}
                    onChange={(e) => setRw(e.target.value.substring(0, 2))}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>

              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Hak Akses Sistem</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Warga">Warga Biasa</option>
                  <option value="Pengurus">Pengurus RT/RW (Akses Penuh)</option>
                  <option value="Satpam">Satpam / Pos Ronda Keamanan</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t border-slate-100">
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
                  id="submit-warga-form"
                >
                  {editingWarga ? 'Simpan Perubahan' : 'Daftarkan Warga'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
