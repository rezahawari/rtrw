/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Warga, Polling as PollingType } from '../types';
import { repository } from '../data/repository';
import { Activity, Plus, CheckCircle, BarChart3, Clock, X, Lock } from 'lucide-react';

interface PollingProps {
  currentUser: Warga;
  triggerRefresh: number;
  onRefresh: () => void;
}

export const Polling: React.FC<PollingProps> = ({ currentUser, triggerRefresh, onRefresh }) => {
  const [polls, setPolls] = useState<PollingType[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Form fields
  const [pertanyaan, setPertanyaan] = useState('');
  const [opsiTeks, setOpsiTeks] = useState<string[]>(['', '']);

  useEffect(() => {
    setPolls(repository.getPollingList());
  }, [triggerRefresh]);

  const handleAddOpsiField = () => {
    if (opsiTeks.length >= 6) return;
    setOpsiTeks([...opsiTeks, '']);
  };

  const handleOpsiChange = (index: number, val: string) => {
    const updated = [...opsiTeks];
    updated[index] = val;
    setOpsiTeks(updated);
  };

  const handleRemoveOpsiField = (index: number) => {
    if (opsiTeks.length <= 2) return;
    setOpsiTeks(opsiTeks.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filteredOpsi = opsiTeks.filter((o) => o.trim() !== '');
    if (filteredOpsi.length < 2) {
      alert('Minimal masukkan 2 opsi jawaban.');
      return;
    }

    repository.createPolling({
      pertanyaan,
      opsiTeks: filteredOpsi,
    });

    setShowAddModal(false);
    setPertanyaan('');
    setOpsiTeks(['', '']);
    onRefresh();
  };

  const handleVote = (pollingId: string, opsiId: string) => {
    repository.votePolling(pollingId, currentUser.id, opsiId);
    onRefresh();
  };

  const handleClosePoll = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menutup polling ini? Warga tidak akan bisa memberikan suara lagi.')) {
      repository.closePolling(id);
      onRefresh();
    }
  };

  const isPengurus = currentUser.role === 'Pengurus';

  return (
    <div className="space-y-6">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-slate-800 flex items-center gap-2">
            <Activity className="h-6 w-6 text-emerald-600" /> Polling & Aspirasi Warga
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Suara Anda menentukan kemajuan rukun tetangga. Berikan suara Anda pada mufakat bersama.
          </p>
        </div>

        {isPengurus && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-sm"
            id="add-polling-button"
          >
            <Plus className="h-4 w-4" /> Polling Baru
          </button>
        )}
      </div>

      {/* Poll list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {polls.length > 0 ? (
          polls.map((p) => {
            const hasVoted = p.voters.includes(currentUser.id);
            const myVoteId = p.pilihan[currentUser.id];
            const totalVotes = p.voters.length;
            const isClosed = p.status === 'Selesai';

            return (
              <div 
                key={p.id} 
                className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 md:p-6 flex flex-col justify-between hover:border-slate-200 transition-colors"
              >
                <div>
                  {/* Metadata */}
                  <div className="flex justify-between items-center mb-3">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                      isClosed ? 'bg-slate-100 text-slate-600' : 'bg-emerald-50 text-emerald-800 animate-pulse'
                    }`}>
                      {isClosed ? <Lock className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                      {isClosed ? 'Selesai' : 'Aktif'}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono font-semibold">
                      Total Suara: <span className="text-slate-700 font-bold">{totalVotes}</span>
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-800 text-sm md:text-base leading-snug mb-4">
                    {p.pertanyaan}
                  </h3>

                  {/* Options List */}
                  <div className="space-y-3">
                    {p.opsi.map((opt) => {
                      const votePct = totalVotes > 0 ? Math.round((opt.votesCount / totalVotes) * 100) : 0;
                      const isMyChoice = myVoteId === opt.id;

                      return (
                        <div key={opt.id} className="relative">
                          {hasVoted || isClosed ? (
                            /* Result view (Bar chart) */
                            <div className="border border-slate-100 p-3 rounded-xl bg-slate-50 overflow-hidden relative">
                              {/* Background progress fill */}
                              <div 
                                className={`absolute left-0 top-0 bottom-0 transition-all duration-500 rounded-l-xl ${
                                  isMyChoice ? 'bg-emerald-100/70 border-r-2 border-emerald-500' : 'bg-slate-200/50'
                                }`}
                                style={{ width: `${votePct}%` }}
                              />
                              
                              <div className="relative flex justify-between items-center text-xs font-semibold">
                                <span className="text-slate-700 flex items-center gap-1">
                                  {isMyChoice && <span className="text-emerald-600 font-bold text-xs" title="Pilihan Anda">✓</span>}
                                  {opt.teks}
                                </span>
                                <span className="font-bold text-slate-800 font-mono">
                                  {opt.votesCount} Suara ({votePct}%)
                                </span>
                              </div>
                            </div>
                          ) : (
                            /* Interactive Voting buttons */
                            <button
                              onClick={() => handleVote(p.id, opt.id)}
                              className="w-full text-left p-3 border border-slate-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50/20 text-xs font-semibold text-slate-700 hover:text-emerald-800 transition-all flex items-center justify-between"
                            >
                              <span>{opt.teks}</span>
                              <span className="text-[10px] text-slate-400 font-medium">Klik untuk Vote</span>
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="pt-4 mt-5 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono">
                    Dibuat: {new Date(p.createdAt).toLocaleDateString('id-ID')}
                  </span>
                  
                  {isPengurus && !isClosed && (
                    <button
                      onClick={() => handleClosePoll(p.id)}
                      className="text-xs bg-red-50 hover:bg-red-100 text-red-700 font-bold py-1 px-3 rounded-lg transition-colors"
                    >
                      Tutup Polling
                    </button>
                  )}
                </div>

              </div>
            );
          })
        ) : (
          <div className="col-span-2 py-16 text-center text-slate-400 flex flex-col items-center">
            <BarChart3 className="h-12 w-12 text-slate-200 mb-2" />
            <p className="font-bold text-slate-600">Belum Ada Polling Aktif</p>
            <p className="text-slate-400 text-xs mt-0.5">Semua pengambilan suara atau jajak pendapat warga akan tampil di sini.</p>
          </div>
        )}
      </div>

      {/* CREATE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowAddModal(false)} />
          
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col">
            
            <div className="bg-emerald-600 text-white px-6 py-4 flex justify-between items-center">
              <h3 className="font-bold text-base font-display">Buat Polling Baru</h3>
              <button onClick={() => setShowAddModal(false)} className="hover:bg-emerald-700 p-1 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Pertanyaan Polling</label>
                <textarea
                  required
                  rows={2}
                  value={pertanyaan}
                  onChange={(e) => setPertanyaan(e.target.value)}
                  placeholder="Contoh: Apakah disetujui jika kita membeli portal siskamling baru?"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Opsi fields */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase">
                  <span>Pilihan Jawaban</span>
                  {opsiTeks.length < 6 && (
                    <button type="button" onClick={handleAddOpsiField} className="text-emerald-600 hover:underline">
                      + Tambah Opsi
                    </button>
                  )}
                </div>

                {opsiTeks.map((opsi, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={opsi}
                      onChange={(e) => handleOpsiChange(index, e.target.value)}
                      placeholder={`Opsi ${index + 1}`}
                      className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden"
                    />
                    {opsiTeks.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOpsiField(index)}
                        className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
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
                  id="submit-polling"
                >
                  Buka Polling ✔️
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
