/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Warga, PanicAlert, Pengumuman, KalenderKegiatan, TagihanIuran, SuratPengantar } from '../types';
import { repository } from '../data/repository';
import { 
  AlertTriangle, 
  Megaphone, 
  Calendar, 
  FileText, 
  DollarSign, 
  Plus, 
  Clock, 
  MapPin, 
  Phone, 
  CheckCircle,
  Bell,
  ArrowRight,
  ShieldAlert,
  ShoppingBag,
  Wrench,
  Key,
  Flame,
  Activity,
  UserCheck
} from 'lucide-react';

interface DashboardProps {
  user: Warga;
  onNavigate: (route: string) => void;
  triggerRefresh: number;
  onRefresh: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate, triggerRefresh, onRefresh }) => {
  const [activeAlerts, setActiveAlerts] = useState<PanicAlert[]>([]);
  const [announcements, setAnnouncements] = useState<Pengumuman[]>([]);
  const [events, setEvents] = useState<KalenderKegiatan[]>([]);
  const [unpaidBills, setUnpaidBills] = useState<TagihanIuran[]>([]);
  const [pendingSurat, setPendingSurat] = useState<SuratPengantar[]>([]);
  
  // Panic Modal states
  const [showPanicModal, setShowPanicModal] = useState(false);
  const [panicType, setPanicType] = useState<'Kemalingan' | 'Kebakaran' | 'Medis' | 'Lainnya'>('Kemalingan');
  const [panicNotes, setPanicNotes] = useState('');
  const [panicLoc, setPanicLoc] = useState('');
  const [panicTriggered, setPanicTriggered] = useState(false);

  // Load Data
  useEffect(() => {
    const alerts = repository.getPanicAlertList().filter((a) => a.status === 'Aktif');
    const anns = repository.getPengumumanList().slice(0, 2);
    const evts = repository.getEventList().filter((e) => new Date(e.tanggal) >= new Date()).slice(0, 2);
    const bills = repository.getTagihanList().filter((b) => b.wargaId === user.id && b.status !== 'Lunas');
    const srt = repository.getSuratList().filter((s) => user.role === 'Pengurus' ? s.status === 'Diajukan' : s.wargaId === user.id);

    setActiveAlerts(alerts);
    setAnnouncements(anns);
    setEvents(evts);
    setUnpaidBills(bills);
    setPendingSurat(srt);
  }, [user.id, user.role, triggerRefresh]);

  // Periodic polling for alerts (simulation of realtime siskamling)
  useEffect(() => {
    const interval = setInterval(() => {
      const active = repository.getPanicAlertList().filter((a) => a.status === 'Aktif');
      if (active.length !== activeAlerts.length) {
        setActiveAlerts(active);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [activeAlerts.length]);

  const handlePanicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    repository.triggerPanicAlert(user.id, panicType, panicNotes, panicLoc);
    setPanicTriggered(true);
    onRefresh();
    setTimeout(() => {
      setPanicTriggered(false);
      setShowPanicModal(false);
      setPanicNotes('');
      setPanicLoc('');
    }, 2000);
  };

  const resolveAlert = (id: string) => {
    repository.updatePanicStatus(id, 'Selesai');
    onRefresh();
  };

  const markHandlingAlert = (id: string) => {
    repository.updatePanicStatus(id, 'Ditangani');
    onRefresh();
  };

  // Stats for Pengurus
  const totalWarga = repository.getWargaList().length;
  const kasStats = repository.getKasStats();
  const pendingBookings = repository.getBookingList().filter((b) => b.status === 'Menunggu').length;
  const unapprovedLetters = repository.getSuratList().filter((s) => s.status === 'Diajukan').length;

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-0.5 rounded-full">
              RT 01 / RW 05
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs text-slate-500 font-mono">
              Role: <span className="font-semibold text-slate-700">{user.role === 'Pengurus' ? 'Pengurus RT' : user.role}</span>
            </span>
          </div>
          <h2 className="text-2xl font-bold font-display tracking-tight text-slate-800 mt-2">
            Halo, {user.nama}!
          </h2>
          <p className="text-slate-500 text-sm mt-0.5">
            Selamat datang di portal layanan digital lingkungan RT 01.
          </p>
        </div>
        
        {/* Quick notification count */}
        <button 
          onClick={() => onNavigate('profil')}
          className="relative p-2.5 bg-slate-50 hover:bg-slate-100 rounded-full border border-slate-200/50 transition-colors"
        >
          <Bell className="h-5 w-5 text-slate-600" />
          {repository.getUnreadCount(user.id) > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
              {repository.getUnreadCount(user.id)}
            </span>
          )}
        </button>
      </div>

      {/* Active emergency bar (for ALL roles if an active alert exists) */}
      {activeAlerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 animate-pulse flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-500 text-white rounded-xl">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-red-900 font-bold text-sm tracking-tight">🚨 ALARM DARURAT AKTIF ({activeAlerts.length})</h3>
              <p className="text-red-700 text-xs mt-0.5">
                {activeAlerts[0].wargaNama} ({activeAlerts[0].jenisDarurat}) di {activeAlerts[0].lokasiManual}.
              </p>
            </div>
          </div>
          <button 
            onClick={() => onNavigate(user.role === 'Satpam' ? 'darurat' : 'darurat')} 
            className="text-xs bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-1.5"
          >
            Lihat Detail <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Main Dashboards split by Role */}

      {/* 1. WARGA DASHBOARD */}
      {user.role === 'Warga' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panic & Quick actions */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Massive Panic Button Card */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 text-white overflow-hidden relative border border-slate-800 shadow-xl flex flex-col md:flex-row items-center gap-6">
              
              <div className="absolute -right-20 -top-20 w-52 h-52 rounded-full bg-red-500/10 blur-3xl" />
              
              {/* Pulse Circle */}
              <div className="relative flex-shrink-0">
                <div className="absolute -inset-2 bg-red-500/20 rounded-full animate-ping duration-1000" />
                <button 
                  onClick={() => setShowPanicModal(true)}
                  className="relative h-32 w-32 bg-red-600 hover:bg-red-500 rounded-full flex flex-col items-center justify-center border-4 border-red-800/50 shadow-2xl transition-transform hover:scale-105 active:scale-95 group cursor-pointer"
                  id="panic-button-warga"
                >
                  <Flame className="h-10 w-10 text-white animate-bounce" />
                  <span className="font-display font-bold text-xs tracking-wider uppercase mt-1">PANIC BUTTON</span>
                </button>
              </div>

              <div className="text-center md:text-left">
                <h3 className="text-lg font-bold font-display tracking-tight text-white flex items-center justify-center md:justify-start gap-1.5">
                  <AlertTriangle className="h-5 w-5 text-red-500" /> Tombol Darurat Warga
                </h3>
                <p className="text-slate-400 text-sm mt-1 leading-relaxed">
                  Tekan dalam keadaan darurat (pencurian, kebakaran, medis, dll). Satpam dan seluruh warga akan langsung mendapatkan notifikasi realtime di device mereka.
                </p>
                <div className="mt-3 flex items-center justify-center md:justify-start gap-1.5 text-xs text-red-400 font-semibold bg-red-500/10 py-1.5 px-3 rounded-lg w-fit">
                  <Activity className="h-3.5 w-3.5 animate-pulse" /> TERKONEKSI KE POS SECURITY
                </div>
              </div>
            </div>

            {/* Quick Service Grid */}
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Layanan Warga</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                <button 
                  onClick={() => onNavigate('surat')}
                  className="bg-white hover:bg-emerald-50/10 p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col items-center text-center transition-all hover:-translate-y-0.5 group"
                >
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
                    <FileText className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 mt-2.5">Surat Pengantar</span>
                </button>

                <button 
                  onClick={() => onNavigate('keuangan')}
                  className="bg-white hover:bg-emerald-50/10 p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col items-center text-center transition-all hover:-translate-y-0.5 group"
                >
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
                    <DollarSign className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 mt-2.5">Iuran & Keuangan</span>
                </button>

                <button 
                  onClick={() => onNavigate('tamu')}
                  className="bg-white hover:bg-emerald-50/10 p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col items-center text-center transition-all hover:-translate-y-0.5 group"
                >
                  <div className="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:scale-110 transition-transform">
                    <UserCheck className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 mt-2.5">Lapor Tamu</span>
                </button>

                <button 
                  onClick={() => onNavigate('pengaduan')}
                  className="bg-white hover:bg-emerald-50/10 p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col items-center text-center transition-all hover:-translate-y-0.5 group"
                >
                  <div className="p-3 bg-rose-50 text-rose-600 rounded-xl group-hover:scale-110 transition-transform">
                    <Wrench className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 mt-2.5">Aduan Fasilitas</span>
                </button>

                <button 
                  onClick={() => onNavigate('pasar')}
                  className="bg-white hover:bg-emerald-50/10 p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col items-center text-center transition-all hover:-translate-y-0.5 group"
                >
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:scale-110 transition-transform">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 mt-2.5">Pasar UMKM</span>
                </button>

                <button 
                  onClick={() => onNavigate('fasilitas')}
                  className="bg-white hover:bg-emerald-50/10 p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col items-center text-center transition-all hover:-translate-y-0.5 group"
                >
                  <div className="p-3 bg-teal-50 text-teal-600 rounded-xl group-hover:scale-110 transition-transform">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 mt-2.5">Pinjam Alat</span>
                </button>

                <button 
                  onClick={() => onNavigate('ronda')}
                  className="bg-white hover:bg-emerald-50/10 p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col items-center text-center transition-all hover:-translate-y-0.5 group"
                >
                  <div className="p-3 bg-sky-50 text-sky-600 rounded-xl group-hover:scale-110 transition-transform">
                    <Key className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 mt-2.5">Jadwal Ronda</span>
                </button>

                <button 
                  onClick={() => onNavigate('polling')}
                  className="bg-white hover:bg-emerald-50/10 p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col items-center text-center transition-all hover:-translate-y-0.5 group"
                >
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:scale-110 transition-transform">
                    <Activity className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 mt-2.5">Voting Polling</span>
                </button>
              </div>
            </div>
          </div>

          {/* Citizen status sidebar / bills info */}
          <div className="space-y-6">
            
            {/* Bills widget */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <DollarSign className="h-4.5 w-4.5 text-blue-500" /> Tagihan Iuran
                </h4>
                <button 
                  onClick={() => onNavigate('keuangan')}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center"
                >
                  Detail <ArrowRight className="h-3 w-3 ml-0.5" />
                </button>
              </div>

              {unpaidBills.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs text-rose-500 font-semibold mb-2">Anda memiliki {unpaidBills.length} tagihan belum dibayar:</p>
                  {unpaidBills.slice(0, 3).map((b) => (
                    <div key={b.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center text-xs">
                      <div>
                        <div className="font-semibold text-slate-800">{b.masterIuranNama}</div>
                        <div className="text-slate-500 mt-0.5">Bulan: {b.bulan}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-800">Rp {b.nominal.toLocaleString('id-ID')}</div>
                        <span className="text-[9px] bg-red-100 text-red-800 px-1.5 py-0.5 rounded font-bold uppercase mt-1 inline-block">
                          Belum Bayar
                        </span>
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={() => onNavigate('keuangan')}
                    className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-xl text-xs transition-colors"
                  >
                    Bayar Sekarang
                  </button>
                </div>
              ) : (
                <div className="py-6 text-center text-slate-400 text-xs">
                  <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                  <p className="font-semibold text-slate-700">Semua Iuran Lunas!</p>
                  <p className="mt-0.5 text-slate-400">Terima kasih atas partisipasi aktif Anda.</p>
                </div>
              )}
            </div>

            {/* Letter status widget */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <FileText className="h-4.5 w-4.5 text-emerald-500" /> Status Pengajuan Surat
                </h4>
                <button 
                  onClick={() => onNavigate('surat')}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center"
                >
                  Semua <ArrowRight className="h-3 w-3 ml-0.5" />
                </button>
              </div>

              {pendingSurat.length > 0 ? (
                <div className="space-y-2">
                  {pendingSurat.slice(0, 2).map((s) => (
                    <div key={s.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs">
                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-slate-800">Pengantar {s.jenis}</span>
                        <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                          s.status === 'Selesai' ? 'bg-green-100 text-green-800' :
                          s.status === 'Diproses' ? 'bg-amber-100 text-amber-800' :
                          s.status === 'Ditolak' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {s.status}
                        </span>
                      </div>
                      <p className="text-slate-400 text-[10px] mt-1">Diajukan: {new Date(s.createdAt).toLocaleDateString('id-ID')}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-4 text-center text-slate-400 text-xs">
                  <p>Belum ada pengajuan surat aktif</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. SATPAM DASHBOARD */}
      {user.role === 'Satpam' && (
        <div className="space-y-6">
          {/* Active Alarms Feed */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6">
            <h3 className="text-lg font-bold text-slate-800 font-display flex items-center gap-2 mb-4">
              <ShieldAlert className="h-5 w-5 text-red-600 animate-pulse" /> MONITOR ALARM DARURAT
            </h3>
            
            {activeAlerts.length > 0 ? (
              <div className="space-y-4">
                {activeAlerts.map((alert) => (
                  <div key={alert.id} className="bg-red-50 border border-red-200 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-pulse">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="bg-red-600 text-white font-bold text-xs px-2.5 py-0.5 rounded-full uppercase">
                          {alert.jenisDarurat}
                        </span>
                        <span className="text-slate-500 text-xs font-mono">
                          ID: {alert.id}
                        </span>
                      </div>
                      <div className="font-bold text-slate-800 text-lg">
                        {alert.wargaNama}
                      </div>
                      <div className="flex flex-col gap-1 text-sm text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4 text-slate-400" /> Alamat: <span className="font-semibold text-slate-700">{alert.lokasiManual}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-4 w-4 text-slate-400" /> Telp: <span className="font-semibold text-slate-700">{alert.noHp}</span>
                        </div>
                        {alert.keterangan && (
                          <div className="bg-white/60 p-2.5 rounded-lg text-xs italic mt-1 border border-red-100 text-slate-700">
                            "{alert.keterangan}"
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                      <button 
                        onClick={() => markHandlingAlert(alert.id)}
                        className="flex-1 md:flex-none bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-colors"
                      >
                        Mulai Tangani
                      </button>
                      <button 
                        onClick={() => resolveAlert(alert.id)}
                        className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-colors"
                      >
                        Selesaikan
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 flex flex-col items-center">
                <CheckCircle className="h-12 w-12 text-emerald-500 mb-3" />
                <h4 className="font-bold text-slate-700 text-base">Situasi Aman Terkendali</h4>
                <p className="text-slate-400 text-sm mt-1">Tidak ada tombol darurat warga yang aktif saat ini.</p>
              </div>
            )}
          </div>

          {/* Quick Actions Grid for Satpam */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Absensi Siskamling QR */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-slate-800 text-sm mb-2 flex items-center gap-1.5">
                  <Key className="h-4.5 w-4.5 text-blue-500" /> Absen Siskamling Ronda
                </h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Lakukan absensi pos ronda malam ini secara instan sebagai bukti patroli siskamling aktif.
                </p>
              </div>
              <button 
                onClick={() => onNavigate('ronda')}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl text-xs text-center transition-colors block"
              >
                Absen / Lihat Jadwal Ronda
              </button>
            </div>

            {/* Catat Tamu Menginap */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-slate-800 text-sm mb-2 flex items-center gap-1.5">
                  <UserCheck className="h-4.5 w-4.5 text-purple-500" /> Catat Tamu Menginap
                </h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Ada tamu menginap &gt; 24 jam? Bantu warga untuk mencatatkan tamu menginap ke dalam sistem admin.
                </p>
              </div>
              <button 
                onClick={() => onNavigate('tamu')}
                className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-xl text-xs text-center transition-colors block"
              >
                Laporkan Tamu
              </button>
            </div>

            {/* Emergency Hotline */}
            <div className="bg-gradient-to-br from-red-600 to-rose-700 text-white rounded-2xl p-5 flex flex-col justify-between shadow-xs">
              <div>
                <h4 className="font-bold text-sm mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="h-4.5 w-4.5 text-white" /> Emergency Hotline RT
                </h4>
                <p className="text-red-100 text-xs leading-relaxed">
                  Hubungi instansi pemadam kebakaran, kepolisian, atau ambulans rumah sakit rujukan terdekat secara cepat.
                </p>
              </div>
              <a 
                href="tel:112"
                className="mt-4 bg-white text-red-700 hover:bg-red-50 text-center font-bold py-2 px-4 rounded-xl text-xs transition-colors block"
              >
                Panggil Layanan Darurat (112)
              </a>
            </div>

          </div>
        </div>
      )}

      {/* 3. PENGURUS (RT/RW) DASHBOARD */}
      {user.role === 'Pengurus' && (
        <div className="space-y-6">
          
          {/* Admin Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Warga</span>
              <div className="text-3xl font-bold text-slate-800 mt-1 font-display">{totalWarga}</div>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded mt-1 inline-block">
                Terdaftar di RT 01
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Kas RT (Saldo)</span>
              <div className="text-2xl font-bold text-emerald-600 mt-1 font-mono">
                Rp {kasStats.saldo.toLocaleString('id-ID')}
              </div>
              <span className="text-[10px] text-slate-400 mt-2 block">
                Total Pemasukan: Rp {kasStats.totalPemasukan.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Persetujuan Surat</span>
              <div className="text-3xl font-bold text-slate-800 mt-1 font-display">{unapprovedLetters}</div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded mt-1 inline-block font-bold ${
                unapprovedLetters > 0 ? 'bg-amber-100 text-amber-800 animate-pulse' : 'bg-slate-100 text-slate-500'
              }`}>
                {unapprovedLetters > 0 ? 'Perlu Diproses' : 'Semua Selesai'}
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Booking Alat</span>
              <div className="text-3xl font-bold text-slate-800 mt-1 font-display">{pendingBookings}</div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded mt-1 inline-block font-bold ${
                pendingBookings > 0 ? 'bg-amber-100 text-amber-800 animate-pulse' : 'bg-slate-100 text-slate-500'
              }`}>
                {pendingBookings > 0 ? 'Menunggu Approval' : 'Semua Selesai'}
              </span>
            </div>

          </div>

          {/* Quick Actions Panel for Admin */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Aksi Cepat Pengurus</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button 
                onClick={() => onNavigate('warga')}
                className="p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-emerald-50/20 hover:border-emerald-200 text-left transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="font-bold text-slate-800 text-xs group-hover:text-emerald-700">Kelola Warga</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Tambah / Edit data warga</div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
              </button>

              <button 
                onClick={() => onNavigate('surat')}
                className="p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-emerald-50/20 hover:border-emerald-200 text-left transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="font-bold text-slate-800 text-xs group-hover:text-emerald-700">Approve Surat</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Beri tanda tangan pengantar</div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
              </button>

              <button 
                onClick={() => onNavigate('keuangan')}
                className="p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-emerald-50/20 hover:border-emerald-200 text-left transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="font-bold text-slate-800 text-xs group-hover:text-emerald-700">Input Kas Keluar</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Catat pengeluaran kas RT</div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
              </button>

              <button 
                onClick={() => onNavigate('pengumuman')}
                className="p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-emerald-50/20 hover:border-emerald-200 text-left transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="font-bold text-slate-800 text-xs group-hover:text-emerald-700">Kirim Pengumuman</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Kirim broadcast info warga</div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shared Community Feeds (Announcements & Events) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Latest Announcements */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800 font-display flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-emerald-600" /> Pengumuman Terbaru
            </h3>
            <button 
              onClick={() => onNavigate('pengumuman')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center"
            >
              Semua <ArrowRight className="h-3 w-3 ml-0.5" />
            </button>
          </div>

          <div className="space-y-4">
            {announcements.length > 0 ? (
              announcements.map((ann) => (
                <div key={ann.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      ann.kategori === 'Kegiatan' ? 'bg-emerald-100 text-emerald-800' :
                      ann.kategori === 'Keamanan' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {ann.kategori}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(ann.createdAt).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">{ann.judul}</h4>
                  <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">{ann.isi}</p>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-slate-400 text-sm">
                Tidak ada pengumuman saat ini.
              </div>
            )}
          </div>
        </div>

        {/* Calendar Events */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800 font-display flex items-center gap-2">
              <Calendar className="h-5 w-5 text-emerald-600" /> Agenda Kegiatan RT
            </h3>
            <button 
              onClick={() => onNavigate('kalender')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center"
            >
              Kalender <ArrowRight className="h-3 w-3 ml-0.5" />
            </button>
          </div>

          <div className="space-y-4">
            {events.length > 0 ? (
              events.map((evt) => (
                <div key={evt.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex gap-3 items-start">
                  
                  {/* Calendar block */}
                  <div className="bg-emerald-600 text-white rounded-lg p-2 flex flex-col items-center w-12 flex-shrink-0 text-center font-display">
                    <span className="text-[9px] font-bold uppercase leading-none">Jul</span>
                    <span className="text-lg font-bold leading-none mt-1">{evt.tanggal.split('-')[2]}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                      <Clock className="h-3 w-3" /> <span>{evt.waktu} WIB</span>
                      <span>•</span>
                      <MapPin className="h-3 w-3" /> <span className="truncate max-w-[120px]">{evt.lokasi}</span>
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm">{evt.judul}</h4>
                    <p className="text-slate-500 text-xs line-clamp-1">{evt.deskripsi}</p>
                  </div>

                </div>
              ))
            ) : (
              <div className="py-8 text-center text-slate-400 text-sm">
                Tidak ada agenda terdekat saat ini.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* PANIC MODAL */}
      {showPanicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowPanicModal(false)} />
          
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150 p-6">
            
            {/* Modal Header */}
            <div className="text-center mb-6">
              <div className="inline-flex p-3 bg-red-100 text-red-600 rounded-full mb-3">
                <AlertTriangle className="h-8 w-8 text-red-600 animate-bounce" />
              </div>
              <h3 className="text-xl font-bold font-display text-slate-800 tracking-tight">KIRIM ALARM DARURAT</h3>
              <p className="text-slate-500 text-xs mt-1">
                Laporan darurat akan dikirimkan langsung ke Pos Satpam dan memicu alarm warga.
              </p>
            </div>

            {panicTriggered ? (
              <div className="py-8 text-center space-y-3">
                <div className="h-16 w-16 bg-red-600 rounded-full flex items-center justify-center mx-auto text-white font-bold animate-ping">
                  🚨
                </div>
                <h4 className="font-bold text-red-600 text-lg">ALARM DIKIRIMKAN!</h4>
                <p className="text-slate-500 text-sm">Petugas Keamanan (Satpam) sedang merespon laporan Anda.</p>
              </div>
            ) : (
              <form onSubmit={handlePanicSubmit} className="space-y-4">
                
                {/* Emergency types selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Jenis Darurat</label>
                  <div className="grid grid-cols-2 gap-2">
                    {([
                      { value: 'Kemalingan', label: 'Kemalingan / Maling', icon: '👤' },
                      { value: 'Kebakaran', label: 'Kebakaran', icon: '🔥' },
                      { value: 'Medis', label: 'Medis / Sakit', icon: '🚑' },
                      { value: 'Lainnya', label: 'Lainnya', icon: '⚠️' }
                    ] as const).map((t) => (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => setPanicType(t.value)}
                        className={`p-3 text-sm rounded-xl border font-bold flex items-center gap-2 transition-all ${
                          panicType === t.value
                            ? 'bg-red-50 border-red-500 text-red-800 ring-2 ring-red-500/20'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span className="text-lg">{t.icon}</span>
                        <span>{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location Manual */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Lokasi Kejadian</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Depan Pos 1, Belakang Lapangan, dll..."
                    value={panicLoc}
                    onChange={(e) => setPanicLoc(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-red-500"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Default: Alamat profil Anda ({user.alamat})</p>
                </div>

                {/* Keterangan */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Keterangan / Kebutuhan</label>
                  <textarea
                    rows={2}
                    placeholder="Beri keterangan singkat bantuan yang dibutuhkan..."
                    value={panicNotes}
                    onChange={(e) => setPanicNotes(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {/* Confirm Buttons */}
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPanicModal(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold py-2.5 rounded-xl transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-2.5 rounded-xl transition-colors shadow-lg shadow-red-600/20"
                    id="confirm-panic"
                  >
                    Kirim Alarm! 🚨
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
