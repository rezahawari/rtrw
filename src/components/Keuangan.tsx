/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Warga, TagihanIuran, PengeluaranKas } from '../types';
import { repository } from '../data/repository';
import { 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Wallet, 
  Download, 
  Plus, 
  Filter, 
  CheckCircle, 
  X,
  CreditCard
} from 'lucide-react';

interface KeuanganProps {
  currentUser: Warga;
  triggerRefresh: number;
  onRefresh: () => void;
}

export const Keuangan: React.FC<KeuanganProps> = ({ currentUser, triggerRefresh, onRefresh }) => {
  const [kasStats, setKasStats] = useState({ totalPemasukan: 0, totalPengeluaran: 0, saldo: 0 });
  const [tagihanList, setTagihanList] = useState<TagihanIuran[]>([]);
  const [pengeluaranList, setPengeluaranList] = useState<PengeluaranKas[]>([]);
  
  // Filters
  const [billingFilter, setBillingFilter] = useState<'All' | 'Lunas' | 'Belum Bayar' | 'Jatuh Tempo'>('All');
  const [billingWargaFilter, setBillingWargaFilter] = useState('');
  
  // Modal State
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseNominal, setExpenseNominal] = useState('');
  const [expenseCategory, setExpenseCategory] = useState<'Operasional' | 'Kegiatan' | 'Keamanan' | 'Lainnya'>('Operasional');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().substring(0, 10));
  const [expenseNotes, setExpenseNotes] = useState('');

  useEffect(() => {
    setKasStats(repository.getKasStats());
    setTagihanList(repository.getTagihanList());
    setPengeluaranList(repository.getPengeluaranList());
  }, [triggerRefresh]);

  const handlePay = (id: string, nominal: number, name: string) => {
    if (confirm(`Apakah Anda ingin melunasi tagihan ${name} senilai Rp ${nominal.toLocaleString('id-ID')}?`)) {
      repository.payTagihan(id);
      onRefresh();
    }
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const nominalNum = parseFloat(expenseNominal);
    if (isNaN(nominalNum) || nominalNum <= 0) {
      alert('Nominal pengeluaran harus berupa angka positif.');
      return;
    }

    repository.createPengeluaran({
      judul: expenseTitle,
      nominal: nominalNum,
      kategori: expenseCategory,
      tanggal: expenseDate,
      keterangan: expenseNotes,
    });

    setShowExpenseModal(false);
    setExpenseTitle('');
    setExpenseNominal('');
    setExpenseNotes('');
    onRefresh();
  };

  // Export report to CSV
  const handleExportCSV = () => {
    // Generate simple rows
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'LAPORAN KEUANGAN KAS RT 01 / RW 05 MENTENG\n';
    csvContent += `Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')}\n\n`;
    
    csvContent += '--- LEDGER PEMASUKAN IURAN LUNAS ---\n';
    csvContent += 'ID,Nama Warga,Jenis Iuran,Bulan,Nominal,Tanggal Bayar\n';
    tagihanList.filter((t) => t.status === 'Lunas').forEach((t) => {
      csvContent += `"${t.id}","${t.wargaNama}","${t.masterIuranNama}","${t.bulan}",${t.nominal},"${t.tanggalBayar ? new Date(t.tanggalBayar).toLocaleDateString('id-ID') : '-'}"\n`;
    });

    csvContent += '\n--- LEDGER PENGELUARAN KAS ---\n';
    csvContent += 'ID,Kategori,Judul Pengeluaran,Nominal,Tanggal\n';
    pengeluaranList.forEach((p) => {
      csvContent += `"${p.id}","${p.kategori}","${p.judul}",${p.nominal},"${p.tanggal}"\n`;
    });

    csvContent += `\nRINGKASAN:\n`;
    csvContent += `Total Pemasukan,Rp ${kasStats.totalPemasukan}\n`;
    csvContent += `Total Pengeluaran,Rp ${kasStats.totalPengeluaran}\n`;
    csvContent += `Saldo Kas Bersih,Rp ${kasStats.saldo}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Keuangan_RT01_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter bills
  const filteredBills = tagihanList.filter((b) => {
    const matchesStatus = billingFilter === 'All' || b.status === billingFilter;
    const matchesWarga = b.wargaNama.toLowerCase().includes(billingWargaFilter.toLowerCase()) || 
                          b.masterIuranNama.toLowerCase().includes(billingWargaFilter.toLowerCase());

    // If currentUser is standard Warga, they only see their own bills
    if (currentUser.role === 'Warga') {
      return matchesStatus && matchesWarga && b.wargaId === currentUser.id;
    }
    return matchesStatus && matchesWarga;
  });

  const isBendaharaOrRT = currentUser.role === 'Pengurus';

  return (
    <div className="space-y-6">
      
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-slate-800 flex items-center gap-2">
            <Wallet className="h-6 w-6 text-emerald-600" /> Transparansi Kas & Iuran Warga
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Laporan keuangan berkala, pencatatan pengeluaran, dan status tagihan warga RT 01.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center gap-1.5"
          >
            <Download className="h-4 w-4" /> Export CSV
          </button>
          
          {isBendaharaOrRT && (
            <button
              onClick={() => setShowExpenseModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-sm"
              id="add-expense-button"
            >
              <Plus className="h-4 w-4" /> Catat Kas Keluar
            </button>
          )}
        </div>
      </div>

      {/* Financial Status Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Net Cash */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Saldo Kas RT</span>
            <span className="text-2xl font-bold text-slate-800 font-mono">Rp {kasStats.saldo.toLocaleString('id-ID')}</span>
            <p className="text-[10px] text-slate-400">Total simpanan bersih di rekening RT</p>
          </div>
          <div className="p-3 bg-slate-100 text-slate-700 rounded-xl">
            <Wallet className="h-6 w-6" />
          </div>
        </div>

        {/* Total Revenues */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Total Pemasukan</span>
            <span className="text-2xl font-bold text-emerald-600 font-mono">Rp {kasStats.totalPemasukan.toLocaleString('id-ID')}</span>
            <p className="text-[10px] text-emerald-600/70 font-semibold flex items-center gap-0.5">
              <ArrowUpRight className="h-3.5 w-3.5" /> Akumulasi iuran lunas warga
            </p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <DollarSign className="h-6 w-6" />
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Total Pengeluaran</span>
            <span className="text-2xl font-bold text-rose-600 font-mono">Rp {kasStats.totalPengeluaran.toLocaleString('id-ID')}</span>
            <p className="text-[10px] text-rose-600/70 font-semibold flex items-center gap-0.5">
              <ArrowDownLeft className="h-3.5 w-3.5" /> Belanja & operasional RT
            </p>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <ArrowDownLeft className="h-6 w-6" />
          </div>
        </div>

      </div>

      {/* Grid Layout: Iuran Table & Outflow Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Bills list */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-xs p-5 flex flex-col max-h-[550px] overflow-hidden">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <h3 className="text-sm font-bold text-slate-800">
              {currentUser.role === 'Warga' ? 'Daftar Tagihan Iuran Anda' : 'Manajemen Tagihan Iuran Warga'}
            </h3>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder={currentUser.role === 'Warga' ? 'Cari iuran...' : 'Cari nama warga...'}
                value={billingWargaFilter}
                onChange={(e) => setBillingWargaFilter(e.target.value)}
                className="px-2.5 py-1 text-xs border border-slate-200 rounded-lg focus:outline-hidden"
              />
              <select
                value={billingFilter}
                onChange={(e) => setBillingFilter(e.target.value as any)}
                className="px-2 py-1 text-xs border border-slate-200 rounded-lg focus:outline-hidden"
              >
                <option value="All">Semua Status</option>
                <option value="Lunas">Lunas</option>
                <option value="Belum Bayar">Belum Bayar</option>
                <option value="Jatuh Tempo">Jatuh Tempo</option>
              </select>
            </div>
          </div>

          {/* Bills Grid / Table */}
          <div className="overflow-y-auto divide-y divide-slate-100 pr-1 flex-1">
            {filteredBills.length > 0 ? (
              filteredBills.map((b) => (
                <div key={b.id} className="py-3 flex items-center justify-between text-xs hover:bg-slate-50/50 px-2 rounded-xl">
                  <div>
                    {currentUser.role !== 'Warga' && (
                      <div className="font-bold text-slate-800">{b.wargaNama}</div>
                    )}
                    <div className="font-semibold text-slate-600 mt-0.5">{b.masterIuranNama}</div>
                    <div className="text-slate-400 mt-0.5 font-mono text-[10px]">Periode: {b.bulan}</div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-bold text-slate-800 font-mono">Rp {b.nominal.toLocaleString('id-ID')}</div>
                      <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded uppercase mt-0.5 ${
                        b.status === 'Lunas' ? 'bg-green-100 text-green-800' :
                        b.status === 'Belum Bayar' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {b.status}
                      </span>
                    </div>

                    {b.status !== 'Lunas' && (
                      <button
                        onClick={() => handlePay(b.id, b.nominal, b.masterIuranNama)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold py-1.5 px-2.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <CreditCard className="h-3 w-3" /> Bayar
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-slate-400">
                Tidak ada data tagihan iuran yang cocok.
              </div>
            )}
          </div>

        </div>

        {/* Expense outflow log */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 flex flex-col max-h-[550px] overflow-hidden">
          <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">
            Ledger Pengeluaran Kas RT
          </h3>

          <div className="overflow-y-auto divide-y divide-slate-100 pr-1 flex-1">
            {pengeluaranList.length > 0 ? (
              pengeluaranList.map((p) => (
                <div key={p.id} className="py-3 text-xs space-y-1">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-800">{p.judul}</span>
                    <span className="font-bold text-rose-600 font-mono">- Rp {p.nominal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[10px] font-mono">
                    <span>Kat: {p.kategori}</span>
                    <span>{new Date(p.tanggal).toLocaleDateString('id-ID')}</span>
                  </div>
                  {p.keterangan && (
                    <p className="text-slate-500 text-[11px] italic">"{p.keterangan}"</p>
                  )}
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-slate-400">
                Belum ada pengeluaran kas dicatat.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* CREATE EXPENSE MODAL */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowExpenseModal(false)} />
          
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col">
            
            <div className="bg-emerald-600 text-white px-6 py-4 flex justify-between items-center">
              <h3 className="font-bold text-base font-display">Catat Pengeluaran Kas Baru</h3>
              <button onClick={() => setShowExpenseModal(false)} className="hover:bg-emerald-700 p-1 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="p-6 space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nama Pengeluaran (Judul)</label>
                <input
                  type="text"
                  required
                  value={expenseTitle}
                  onChange={(e) => setExpenseTitle(e.target.value)}
                  placeholder="Contoh: Pembelian lampu selokan Mawar"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nominal (Rupiah)</label>
                  <input
                    type="number"
                    required
                    value={expenseNominal}
                    onChange={(e) => setExpenseNominal(e.target.value)}
                    placeholder="Contoh: 150000"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Kategori</label>
                  <select
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Operasional">Operasional RT</option>
                    <option value="Kegiatan">Kegiatan Sosial</option>
                    <option value="Keamanan">Keamanan Ronda</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tanggal Belanja</label>
                <input
                  type="date"
                  required
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Detail Keterangan</label>
                <textarea
                  rows={2}
                  value={expenseNotes}
                  onChange={(e) => setExpenseNotes(e.target.value)}
                  placeholder="Keterangan tambahan opsional..."
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Submit */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold py-2.5 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2.5 rounded-xl transition-colors shadow-sm"
                  id="submit-expense"
                >
                  Simpan Ledger
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
