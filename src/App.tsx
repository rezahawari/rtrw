/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Warga } from './types';
import { repository } from './data/repository';

// Components
import { Dashboard } from './components/Dashboard';
import { Kependudukan } from './components/Kependudukan';
import { Surat } from './components/Surat';
import { Keuangan } from './components/Keuangan';
import { Pengumuman } from './components/Pengumuman';
import { Kalender } from './components/Kalender';
import { Polling } from './components/Polling';
import { Darurat } from './components/Darurat';
import { Ronda } from './components/Ronda';
import { Tamu } from './components/Tamu';
import { Pengaduan } from './components/Pengaduan';
import { Pasar } from './components/Pasar';
import { Fasilitas } from './components/Fasilitas';
import { Profil } from './components/Profil';

// Icons
import {
  Home,
  Users,
  FileText,
  Wallet,
  Megaphone,
  Calendar,
  Activity,
  ShieldAlert,
  Key,
  UserCheck,
  Wrench,
  ShoppingBag,
  Landmark,
  Settings,
  Menu,
  X,
  User,
  ChevronDown
} from 'lucide-react';

type TabType =
  | 'dashboard'
  | 'kependudukan'
  | 'surat'
  | 'keuangan'
  | 'pengumuman'
  | 'kalender'
  | 'polling'
  | 'darurat'
  | 'ronda'
  | 'tamu'
  | 'pengaduan'
  | 'pasar'
  | 'fasilitas'
  | 'profil';

export default function App() {
  const [currentUser, setCurrentUser] = useState<Warga | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [triggerRefresh, setTriggerRefresh] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  useEffect(() => {
    // Check if there's a stored current user or get the default one
    const user = repository.getCurrentUser();
    setCurrentUser(user);
  }, [triggerRefresh]);

  const handleRefresh = () => {
    setTriggerRefresh((prev) => prev + 1);
  };

  const handleUserChange = (newUser: Warga) => {
    repository.setCurrentUser(newUser.id);
    setCurrentUser(newUser);
    setShowUserDropdown(false);
    handleRefresh();
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 font-semibold">
        Menginisialisasi Database RT/RW...
      </div>
    );
  }

  const allWarga = repository.getWargaList();

  const navigationItems = [
    {
      category: 'Utama',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'profil', label: 'Akun & Simulasi', icon: Settings },
      ]
    },
    {
      category: 'Layanan Mandiri Warga',
      items: [
        { id: 'surat', label: 'Surat Pengantar', icon: FileText },
        { id: 'keuangan', label: 'Kas & Iuran', icon: Wallet },
        { id: 'pasar', label: 'Pasar UMKM', icon: ShoppingBag },
        { id: 'fasilitas', label: 'Boking Sarana', icon: Landmark },
      ]
    },
    {
      category: 'Sosial & Komunitas',
      items: [
        { id: 'pengumuman', label: 'Papan Info', icon: Megaphone },
        { id: 'kalender', label: 'Agenda RT', icon: Calendar },
        { id: 'polling', label: 'Aspirasi Polling', icon: Activity },
      ]
    },
    {
      category: 'Keamanan & Ketertiban',
      items: [
        { id: 'darurat', label: 'Pusat Darurat', icon: ShieldAlert },
        { id: 'ronda', label: 'Siskamling', icon: Key },
        { id: 'tamu', label: 'Lapor Tamu >24j', icon: UserCheck },
        { id: 'pengaduan', label: 'Lapor Kerusakan', icon: Wrench },
      ]
    }
  ];

  // If user is Pengurus, add Data Kependudukan under Administrasi
  const getFilteredNavItems = () => {
    return navigationItems.map(group => {
      if (group.category === 'Layanan Mandiri Warga' && currentUser.role === 'Pengurus') {
        return {
          ...group,
          items: [
            { id: 'kependudukan', label: 'Data Kependudukan', icon: Users },
            ...group.items
          ]
        };
      }
      return group;
    });
  };

  const renderedContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard user={currentUser} onNavigate={(tab) => setActiveTab(tab as TabType)} triggerRefresh={triggerRefresh} onRefresh={handleRefresh} />;
      case 'kependudukan':
        return <Kependudukan currentUser={currentUser} triggerRefresh={triggerRefresh} onRefresh={handleRefresh} />;
      case 'surat':
        return <Surat currentUser={currentUser} triggerRefresh={triggerRefresh} onRefresh={handleRefresh} />;
      case 'keuangan':
        return <Keuangan currentUser={currentUser} triggerRefresh={triggerRefresh} onRefresh={handleRefresh} />;
      case 'pengumuman':
        return <Pengumuman currentUser={currentUser} triggerRefresh={triggerRefresh} onRefresh={handleRefresh} />;
      case 'kalender':
        return <Kalender currentUser={currentUser} triggerRefresh={triggerRefresh} onRefresh={handleRefresh} />;
      case 'polling':
        return <Polling currentUser={currentUser} triggerRefresh={triggerRefresh} onRefresh={handleRefresh} />;
      case 'darurat':
        return <Darurat currentUser={currentUser} triggerRefresh={triggerRefresh} onRefresh={handleRefresh} />;
      case 'ronda':
        return <Ronda currentUser={currentUser} triggerRefresh={triggerRefresh} onRefresh={handleRefresh} />;
      case 'tamu':
        return <Tamu currentUser={currentUser} triggerRefresh={triggerRefresh} onRefresh={handleRefresh} />;
      case 'pengaduan':
        return <Pengaduan currentUser={currentUser} triggerRefresh={triggerRefresh} onRefresh={handleRefresh} />;
      case 'pasar':
        return <Pasar currentUser={currentUser} triggerRefresh={triggerRefresh} onRefresh={handleRefresh} />;
      case 'fasilitas':
        return <Fasilitas currentUser={currentUser} triggerRefresh={triggerRefresh} onRefresh={handleRefresh} />;
      case 'profil':
        return (
          <Profil
            currentUser={currentUser}
            onUserChange={handleUserChange}
            triggerRefresh={triggerRefresh}
            onRefresh={handleRefresh}
          />
        );
      default:
        return <Dashboard currentUser={currentUser} triggerRefresh={triggerRefresh} onRefresh={handleRefresh} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* GLOBAL TOP NAV-BAR */}
      <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-3xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-slate-50 text-slate-600 rounded-xl transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-xl">🏡</span>
            <div>
              <h1 className="font-bold text-slate-800 text-sm md:text-base font-display tracking-tight leading-none">
                RT/RW Digital
              </h1>
              <p className="text-[10px] text-emerald-600 font-bold font-mono tracking-wider uppercase mt-1">
                RT 01 / RW 05 MENTENG
              </p>
            </div>
          </div>
        </div>

        {/* QUICK USER ROLE SWITCHER IN HEADER */}
        <div className="relative">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="bg-slate-50 border border-slate-150 rounded-xl px-3.5 py-1.5 flex items-center gap-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
            id="user-dropdown-trigger"
          >
            <User className="h-4 w-4 text-slate-400" />
            <div className="text-left leading-tight hidden sm:block">
              <p className="font-bold">{currentUser.nama}</p>
              <p className="text-[9px] text-slate-400 uppercase tracking-wider">{currentUser.role}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 p-2 py-3 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
              <span className="text-[10px] text-slate-400 font-bold px-3 uppercase tracking-wider block mb-1">
                Ganti Peran Simulasi
              </span>
              <div className="space-y-1 max-h-60 overflow-y-auto">
                {allWarga.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => handleUserChange(u)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex justify-between items-center transition-colors cursor-pointer ${
                      u.id === currentUser.id 
                        ? 'bg-emerald-50 text-emerald-800 font-bold' 
                        : 'hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span>{u.nama}</span>
                    <span className="text-[9px] text-slate-400 font-medium uppercase">{u.role}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* VIEWPORT LAYOUT WRAPPER */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-100 shrink-0 overflow-y-auto p-4 space-y-6">
          <nav className="space-y-5">
            {getFilteredNavItems().map((group, groupIdx) => (
              <div key={groupIdx} className="space-y-1.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest px-3 block">
                  {group.category}
                </span>
                
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id as TabType);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-all cursor-pointer ${
                          isActive 
                            ? 'bg-emerald-600 text-white shadow-xs font-bold' 
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                        }`}
                      >
                        <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {/* MOBILE SLIDE-OUT MENU DRAWER */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)} />
            
            <aside className="relative flex flex-col w-72 bg-white h-full p-5 space-y-6 overflow-y-auto animate-in slide-in-from-left duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🏡</span>
                  <span className="font-bold text-slate-800 text-sm font-display">RT/RW Menu</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="space-y-5">
                {getFilteredNavItems().map((group, groupIdx) => (
                  <div key={groupIdx} className="space-y-1.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest px-3 block">
                      {group.category}
                    </span>
                    
                    <div className="space-y-0.5">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              setActiveTab(item.id as TabType);
                              setMobileMenuOpen(false);
                            }}
                            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-all ${
                              isActive 
                                ? 'bg-emerald-600 text-white shadow-xs font-bold' 
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                            }`}
                          >
                            <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>
            </aside>
          </div>
        )}

        {/* MAIN DISPLAY AREA */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            {renderedContent()}
          </div>
        </main>

      </div>

    </div>
  );
}
