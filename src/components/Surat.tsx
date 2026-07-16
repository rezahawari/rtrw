/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Warga, SuratPengantar } from '../types';
import { repository } from '../data/repository';
import { FileText, Plus, FileSpreadsheet, Eye, Printer, CheckCircle, Clock, XCircle, ChevronRight, X } from 'lucide-react';

interface SuratProps {
  currentUser: Warga;
  triggerRefresh: number;
  onRefresh: () => void;
}

// Compact Signature Pad inside Surat component
const SignaturePad: React.FC<{
  onSave: (dataUrl: string) => void;
  onClose: () => void;
}> = ({ onSave, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
  }, []);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    // Check if touch event
    if ('touches' in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    onSave(dataUrl);
  };

  return (
    <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-3">
      <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase">
        <span>Goreskan Tanda Tangan Anda</span>
        <button type="button" onClick={clearCanvas} className="text-rose-600 hover:underline">
          Bersihkan
        </button>
      </div>

      <canvas
        ref={canvasRef}
        width={350}
        height={150}
        className="w-full h-[150px] bg-white border border-slate-200 rounded-lg cursor-crosshair touch-none"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />

      <div className="flex gap-2 text-xs">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 bg-slate-200 hover:bg-slate-300 font-semibold py-2 rounded-lg text-slate-700 transition-colors"
        >
          Batal
        </button>
        <button
          type="button"
          onClick={saveSignature}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 font-bold py-2 rounded-lg text-white transition-colors"
        >
          Gunakan Tanda Tangan
        </button>
      </div>
    </div>
  );
};

export const Surat: React.FC<SuratProps> = ({ currentUser, triggerRefresh, onRefresh }) => {
  const [suratList, setSuratList] = useState<SuratPengantar[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedSurat, setSelectedSurat] = useState<SuratPengantar | null>(null);

  // Add Form states
  const [jenis, setJenis] = useState<'KTP' | 'KK' | 'SKCK' | 'Lainnya'>('KTP');
  const [keterangan, setKeterangan] = useState('');
  const [ttdWarga, setTtdWarga] = useState<string | null>(null);
  const [showTtdPad, setShowTtdPad] = useState(false);

  // Approval Form states
  const [catatanPengurus, setCatatanPengurus] = useState('');
  const [ttdPengurus, setTtdPengurus] = useState<string | null>(null);
  const [showPengurusTtdPad, setShowPengurusTtdPad] = useState(false);

  useEffect(() => {
    setSuratList(repository.getSuratList());
  }, [triggerRefresh]);

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ttdWarga) {
      alert('Tanda tangan warga wajib dibubuhkan.');
      return;
    }

    repository.createSurat({
      wargaId: currentUser.id,
      wargaNama: currentUser.nama,
      jenis,
      keterangan,
      tandaTanganWarga: ttdWarga,
    });

    setShowAddModal(false);
    setKeterangan('');
    setTtdWarga(null);
    onRefresh();
  };

  const handleApprove = (s: SuratPengantar) => {
    if (!ttdPengurus) {
      alert('Tanda tangan pengurus wajib dibubuhkan untuk approval.');
      return;
    }
    repository.updateSuratStatus(s.id, 'Selesai', catatanPengurus, ttdPengurus);
    setShowDetailModal(false);
    setCatatanPengurus('');
    setTtdPengurus(null);
    onRefresh();
  };

  const handleReject = (s: SuratPengantar) => {
    const reason = prompt('Masukkan alasan penolakan surat:');
    if (reason === null) return; // cancel
    repository.updateSuratStatus(s.id, 'Ditolak', reason || 'Ditolak oleh Pengurus');
    setShowDetailModal(false);
    onRefresh();
  };

  const handleProcess = (s: SuratPengantar) => {
    repository.updateSuratStatus(s.id, 'Diproses');
    setSelectedSurat({ ...s, status: 'Diproses' });
    onRefresh();
  };

  const handlePrint = () => {
    window.print();
  };

  // Filter list based on role
  const displayedSurat = suratList.filter((s) => {
    if (currentUser.role === 'Pengurus') return true; // Pengurus sees everything
    return s.wargaId === currentUser.id; // Citizen only sees theirs
  });

  return (
    <div className="space-y-6">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-slate-800 flex items-center gap-2">
            <FileSpreadsheet className="h-6 w-6 text-emerald-600" /> Surat Pengantar RT
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Pengajuan & persetujuan surat pengantar keterangan kependudukan secara digital.
          </p>
        </div>

        {currentUser.role === 'Warga' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="h-4 w-4" /> Ajukan Surat Baru
          </button>
        )}
      </div>

      {/* Surat Queue Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5">
        <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">
          {currentUser.role === 'Pengurus' ? 'Antrian Persetujuan Pengurus' : 'Riwayat Pengajuan Surat Anda'}
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-2">ID</th>
                <th className="py-3 px-2">Warga Pelapor</th>
                <th className="py-3 px-2">Jenis Surat</th>
                <th className="py-3 px-2">Keterangan Keperluan</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2">Tanggal Ajuan</th>
                <th className="py-3 px-2 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {displayedSurat.length > 0 ? (
                displayedSurat.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-2 font-mono font-semibold text-slate-500">{s.id}</td>
                    <td className="py-3 px-2 font-bold text-slate-700">{s.wargaNama}</td>
                    <td className="py-3 px-2">
                      <span className="font-semibold bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full uppercase">
                        {s.jenis}
                      </span>
                    </td>
                    <td className="py-3 px-2 max-w-[200px] truncate text-slate-500">{s.keterangan}</td>
                    <td className="py-3 px-2">
                      <span className={`inline-flex items-center gap-1 font-bold text-[10px] px-2 py-0.5 rounded-full uppercase ${
                        s.status === 'Selesai' ? 'bg-green-100 text-green-800' :
                        s.status === 'Diproses' ? 'bg-amber-100 text-amber-800' :
                        s.status === 'Ditolak' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {s.status === 'Selesai' ? <CheckCircle className="h-3 w-3" /> :
                         s.status === 'Diproses' ? <Clock className="h-3 w-3 animate-spin" /> : null}
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-slate-400">{new Date(s.createdAt).toLocaleDateString('id-ID')}</td>
                    <td className="py-3 px-2 text-right">
                      <button
                        onClick={() => {
                          setSelectedSurat(s);
                          setShowDetailModal(true);
                        }}
                        className="inline-flex items-center gap-1 bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 font-semibold px-2.5 py-1.5 rounded-lg transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5" /> Detail
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Belum ada pengajuan surat keterangan pengantar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CITIZEN SUBMIT SURAT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowAddModal(false)} />
          
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
            
            <div className="bg-emerald-600 text-white px-6 py-4 flex justify-between items-center">
              <h3 className="font-bold text-base font-display">Ajukan Surat Pengantar</h3>
              <button onClick={() => setShowAddModal(false)} className="hover:bg-emerald-700 p-1 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitRequest} className="p-6 overflow-y-auto space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Jenis Pengantar Keperluan</label>
                <select
                  value={jenis}
                  onChange={(e) => setJenis(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-sm"
                >
                  <option value="KTP">KTP (Pembuatan Baru / Hilang)</option>
                  <option value="KK">Kartu Keluarga (Penambahan / Perubahan)</option>
                  <option value="SKCK">SKCK (Keterangan Catatan Kepolisian)</option>
                  <option value="Lainnya">Lainnya (Izin Usaha, Domisili, dll)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Deskripsi Alasan / Keterangan Keperluan</label>
                <textarea
                  required
                  rows={3}
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  placeholder="Contoh: Digunakan sebagai syarat pembuatan SKCK perpanjangan kontrak kerja di BUMN..."
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Digital Signature section */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tanda Tangan Pemohon (Warga)</label>
                
                {ttdWarga ? (
                  <div className="border border-slate-100 bg-slate-50 p-4 rounded-xl flex flex-col items-center relative">
                    <img src={ttdWarga} alt="Signature Warga" className="h-16 object-contain" />
                    <button
                      type="button"
                      onClick={() => setTtdWarga(null)}
                      className="absolute top-2 right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <span className="text-[10px] text-slate-400 mt-2 font-semibold">Tanda Tangan Digital Terpasang</span>
                  </div>
                ) : (
                  <div>
                    {showTtdPad ? (
                      <SignaturePad
                        onSave={(data) => {
                          setTtdWarga(data);
                          setShowTtdPad(false);
                        }}
                        onClose={() => setShowTtdPad(false)}
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowTtdPad(true)}
                        className="w-full py-6 border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-xl text-slate-500 hover:text-emerald-600 text-xs font-semibold flex flex-col items-center gap-1 bg-slate-50/50"
                      >
                        ✍️ Klik untuk Menggambar Tanda Tangan
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="flex gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold py-2.5 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2.5 rounded-xl transition-colors"
                >
                  Kirim Ajuan
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* DETAIL & PRINT PREVIEW MODAL */}
      {showDetailModal && selectedSurat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs no-print" onClick={() => setShowDetailModal(false)} />
          
          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[95vh]">
            
            {/* Modal actions - NO PRINT in window.print */}
            <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center no-print">
              <h3 className="font-bold text-sm tracking-tight flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-400" /> DETAIL & SURAT PREVIEW
              </h3>
              <div className="flex items-center gap-2">
                {selectedSurat.status === 'Selesai' && (
                  <button
                    onClick={handlePrint}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 px-3 rounded-lg text-xs transition-colors flex items-center gap-1"
                  >
                    <Printer className="h-3.5 w-3.5" /> Cetak / PDF
                  </button>
                )}
                <button onClick={() => setShowDetailModal(false)} className="hover:bg-slate-800 p-1 rounded-lg">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Print Content Container */}
            <div className="p-6 md:p-8 overflow-y-auto flex-1 bg-slate-50 md:bg-slate-100/50">
              
              {/* Outer template sheet (looks like real letter sheet) */}
              <div className="bg-white p-6 md:p-12 rounded-xl shadow-xs border border-slate-200/60 max-w-2xl mx-auto font-sans text-xs text-black leading-relaxed" id="printable-letter-sheet">
                
                {/* Letter Header */}
                <div className="text-center pb-4 border-b-2 border-black space-y-1">
                  <h1 className="text-base font-bold uppercase tracking-wide">RUKUN TETANGGA 01 / RUKUN WARGA 05</h1>
                  <h2 className="text-sm font-semibold uppercase">KELURAHAN MENTENG, KECAMATAN MENTENG</h2>
                  <h3 className="text-xs">KOTA JAKARTA PUSAT, DKI JAKARTA</h3>
                  <p className="text-[10px] text-slate-500 font-mono no-print">Sistem Surat RT/RW Digital • ID: {selectedSurat.id}</p>
                </div>

                {/* Letter Title */}
                <div className="text-center my-6 space-y-1">
                  <h4 className="text-sm font-bold uppercase underline">SURAT KETERANGAN PENGANTAR</h4>
                  <p className="font-mono">Nomor: {selectedSurat.id}/RT01-RW05/VII/2026</p>
                </div>

                {/* Body intro */}
                <div className="space-y-4">
                  <p>Yang bertanda tangan di bawah ini Rukun Tetangga (RT) 01 Rukun Warga (RW) 05 Kelurahan Menteng, dengan ini menerangkan bahwa:</p>
                  
                  {/* Citizen details */}
                  <table className="w-full text-left ml-4 space-y-1.5">
                    <tbody>
                      <tr>
                        <td className="w-32 text-slate-600 font-semibold py-1">Nama Lengkap</td>
                        <td className="w-4 py-1">:</td>
                        <td className="font-bold py-1 text-slate-800">{selectedSurat.wargaNama}</td>
                      </tr>
                      <tr>
                        <td className="text-slate-600 font-semibold py-1">Kewarganegaraan</td>
                        <td>:</td>
                        <td className="py-1">Indonesia</td>
                      </tr>
                      <tr>
                        <td className="text-slate-600 font-semibold py-1">Alamat Domisili</td>
                        <td>:</td>
                        <td className="py-1">{repository.getWargaById(selectedSurat.wargaId)?.alamat || 'Menteng RT 01'}</td>
                      </tr>
                      <tr>
                        <td className="text-slate-600 font-semibold py-1">NIK (No. KTP)</td>
                        <td>:</td>
                        <td className="py-1 font-mono font-semibold">{repository.getWargaById(selectedSurat.wargaId)?.nik || '-'}</td>
                      </tr>
                    </tbody>
                  </table>

                  <p>Orang tersebut di atas adalah benar warga lingkungan kami yang berdomisili di RT 01/RW 05 Kelurahan Menteng, dan surat pengantar ini dikeluarkan khusus untuk keperluan:</p>
                  
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-lg font-mono text-xs italic text-slate-700">
                    "{selectedSurat.keterangan}"
                  </div>

                  <p>Demikian surat keterangan pengantar ini dibuat dengan sebenarnya agar dapat dipergunakan sebagaimana mestinya.</p>
                </div>

                {/* Signatures Row */}
                <div className="grid grid-cols-2 gap-8 text-center mt-12 pb-6">
                  
                  {/* Warga signature */}
                  <div className="flex flex-col items-center justify-between h-36">
                    <span className="font-medium">Tanda Tangan Pemohon,</span>
                    <div className="h-16 flex items-center justify-center">
                      {selectedSurat.tandaTanganWarga ? (
                        <img src={selectedSurat.tandaTanganWarga} alt="Tanda Tangan Warga" className="h-14 object-contain" />
                      ) : (
                        <span className="text-slate-300 text-xs italic">[Belum Menandatangani]</span>
                      )}
                    </div>
                    <span className="font-bold underline">{selectedSurat.wargaNama}</span>
                  </div>

                  {/* Pengurus signature */}
                  <div className="flex flex-col items-center justify-between h-36">
                    <span className="font-medium">Jakarta, {new Date(selectedSurat.updatedAt || selectedSurat.createdAt).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</span>
                    <div className="h-16 flex items-center justify-center">
                      {selectedSurat.status === 'Selesai' && selectedSurat.tandaTanganPengurus ? (
                        <img src={selectedSurat.tandaTanganPengurus} alt="Tanda Tangan Ketua RT" className="h-14 object-contain" />
                      ) : (
                        <span className="text-slate-400 text-xs italic">[Perlu Ttd Pengurus]</span>
                      )}
                    </div>
                    <span className="font-bold underline">BAMBANG PAMUNGKAS</span>
                    <span className="text-[10px] text-slate-500">Ketua RT 01 / RW 05</span>
                  </div>

                </div>

              </div>

              {/* Approval interactive actions for Pengurus only (hidden if already Selesai) */}
              {currentUser.role === 'Pengurus' && selectedSurat.status !== 'Selesai' && selectedSurat.status !== 'Ditolak' && (
                <div className="bg-white p-5 rounded-xl border border-slate-200 mt-6 max-w-2xl mx-auto space-y-4 no-print shadow-md">
                  <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1">
                    🛡️ Menu Persetujuan Pengurus RT
                  </h5>
                  
                  {selectedSurat.status === 'Diajukan' && (
                    <button
                      onClick={() => handleProcess(selectedSurat)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl text-xs transition-colors"
                    >
                      Tandai Sebagai "Sedang Diproses"
                    </button>
                  )}

                  {selectedSurat.status === 'Diproses' && (
                    <div className="space-y-4">
                      
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Catatan / Pesan Pengurus (Opsional)</label>
                        <input
                          type="text"
                          placeholder="Contoh: Silakan ambil hardcopy fisik atau print PDF ini..."
                          value={catatanPengurus}
                          onChange={(e) => setCatatanPengurus(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden"
                        />
                      </div>

                      {/* Signature for RT */}
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Bubuhkan Ttd Ketua RT</label>
                        {ttdPengurus ? (
                          <div className="border border-slate-100 bg-slate-50 p-3 rounded-lg flex items-center justify-between">
                            <img src={ttdPengurus} alt="Signature RT" className="h-12 object-contain" />
                            <button
                              type="button"
                              onClick={() => setTtdPengurus(null)}
                              className="p-1 bg-red-100 text-red-600 rounded-full"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <div>
                            {showPengurusTtdPad ? (
                              <SignaturePad
                                onSave={(data) => {
                                  setTtdPengurus(data);
                                  setShowPengurusTtdPad(false);
                                }}
                                onClose={() => setShowPengurusTtdPad(false)}
                              />
                            ) : (
                              <button
                                type="button"
                                onClick={() => setShowPengurusTtdPad(true)}
                                className="w-full py-4 border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-xl text-slate-500 text-xs font-semibold flex items-center justify-center gap-2 bg-slate-50"
                              >
                                ✍️ Klik untuk Tanda Tangan Ketua RT
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleReject(selectedSurat)}
                          className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 font-bold py-2.5 rounded-xl text-xs transition-colors"
                        >
                          Tolak Surat
                        </button>
                        <button
                          onClick={() => handleApprove(selectedSurat)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors"
                        >
                          Setujui & Tandatangani ✔️
                        </button>
                      </div>

                    </div>
                  )}

                </div>
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
