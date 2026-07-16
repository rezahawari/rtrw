/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Warga, ProdukUMKM } from '../types';
import { repository } from '../data/repository';
import { ShoppingBag, Plus, Search, MessageCircle, Filter, X, Trash2 } from 'lucide-react';

interface PasarProps {
  currentUser: Warga;
  triggerRefresh: number;
  onRefresh: () => void;
}

export const Pasar: React.FC<PasarProps> = ({ currentUser, triggerRefresh, onRefresh }) => {
  const [products, setProducts] = useState<ProdukUMKM[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'All' | 'Makanan' | 'Pakaian' | 'Jasa' | 'Kerajinan' | 'Lainnya'>('All');

  // Form fields
  const [namaProduk, setNamaProduk] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [harga, setHarga] = useState('');
  const [kategori, setKategori] = useState<'Makanan' | 'Pakaian' | 'Jasa' | 'Kerajinan' | 'Lainnya'>('Makanan');
  const [noHp, setNoHp] = useState(currentUser.noHp || '');

  useEffect(() => {
    setProducts(repository.getProdukUMKMList());
  }, [triggerRefresh]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hargaNum = parseFloat(harga);
    if (isNaN(hargaNum) || hargaNum < 0) {
      alert('Harga produk tidak valid.');
      return;
    }

    repository.createProdukUMKM({
      namaProduk,
      deskripsi,
      harga: hargaNum,
      kategori,
      noHp,
      wargaId: currentUser.id,
      wargaNama: currentUser.nama,
    });

    setShowAddModal(false);
    setNamaProduk('');
    setDeskripsi('');
    setHarga('');
    onRefresh();
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda ingin menarik produk/iklan UMKM ini?')) {
      repository.deleteProdukUMKM(id);
      onRefresh();
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.namaProduk.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.wargaNama.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || p.kategori === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-slate-800 flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-emerald-600" /> Pasar UMKM & Toko Warga
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Dukung ekonomi tetangga dengan berbelanja makanan, jasa, atau sembako karya warga RT 01.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-sm"
          id="add-product-button"
        >
          <Plus className="h-4 w-4" /> Pasang Iklan Jualan
        </button>
      </div>

      {/* Categories & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        
        {/* Category triggers */}
        <div className="flex flex-wrap gap-2 flex-1 items-center">
          {(['All', 'Makanan', 'Pakaian', 'Jasa', 'Kerajinan', 'Lainnya'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                activeCategory === cat 
                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat === 'All' ? 'Semua Produk' : cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="w-full md:w-80 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari produk, warung, jasa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden bg-white shadow-3xs"
          />
        </div>

      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((p) => {
            const isMyProduct = p.wargaId === currentUser.id;
            const cleanNoHp = p.noHp.replace(/\D/g, '');
            // Formulate WhatsApp redirect url
            const waUrl = `https://wa.me/${cleanNoHp.startsWith('0') ? '62' + cleanNoHp.slice(1) : cleanNoHp}?text=Halo%20${encodeURIComponent(p.wargaNama)},%20saya%20tertarik%20dengan%20produk%20"${encodeURIComponent(p.namaProduk)}"%20di%20Pasar%20UMKM%20RT%2001.`;

            return (
              <div 
                key={p.id} 
                className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col justify-between hover:border-slate-200 hover:shadow-xs transition-all relative overflow-hidden group"
              >
                
                {/* Product Core content */}
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-emerald-50 text-emerald-800">
                      {p.kategori}
                    </span>
                    {isMyProduct && (
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Tarik Iklan"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-800 text-sm md:text-base leading-snug">{p.namaProduk}</h3>
                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">"{p.deskripsi}"</p>
                  </div>
                </div>

                {/* Footer specs & Actions */}
                <div className="pt-4 mt-4 border-t border-slate-50 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 block font-medium">Oleh: {p.wargaNama}</span>
                    <span className="text-sm font-bold text-slate-800 font-mono">Rp {p.harga.toLocaleString('id-ID')}</span>
                  </div>

                  {!isMyProduct && (
                    <a
                      href={waUrl}
                      target="_blank"
                      referrerPolicy="no-referrer"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3.5 rounded-xl text-[10px] transition-colors flex items-center gap-1 shadow-xs shadow-emerald-600/10"
                    >
                      <MessageCircle className="h-3.5 w-3.5" /> Chat Penjual
                    </a>
                  )}
                </div>

              </div>
            );
          })
        ) : (
          <div className="col-span-full py-16 text-center text-slate-400 flex flex-col items-center">
            <ShoppingBag className="h-12 w-12 text-slate-200 mb-2" />
            <p className="font-bold text-slate-600">Belum Ada Produk Dijual</p>
            <p className="text-slate-400 text-xs mt-0.5">Semua jualan, warung makan, atau jasa warga akan tampil di sini.</p>
          </div>
        )}
      </div>

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowAddModal(false)} />
          
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col">
            
            <div className="bg-emerald-600 text-white px-6 py-4 flex justify-between items-center">
              <h3 className="font-bold text-base font-display">Pasang Iklan UMKM Baru</h3>
              <button onClick={() => setShowAddModal(false)} className="hover:bg-emerald-700 p-1 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nama Produk / Usaha</label>
                <input
                  type="text"
                  required
                  value={namaProduk}
                  onChange={(e) => setNamaProduk(e.target.value)}
                  placeholder="Contoh: Nasi Goreng Gila Gang Melati"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Harga (Rupiah)</label>
                  <input
                    type="number"
                    required
                    value={harga}
                    onChange={(e) => setHarga(e.target.value)}
                    placeholder="Contoh: 15000"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Kategori Jualan</label>
                  <select
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden"
                  >
                    <option value="Makanan">Makanan & Minuman</option>
                    <option value="Pakaian">Pakaian / Fashion</option>
                    <option value="Jasa">Jasa (Setrika, Servis AC, dll)</option>
                    <option value="Kerajinan">Kerajinan / Kreatif</option>
                    <option value="Lainnya">Lainnya / Sembako / Barang Bekas</option>
                  </select>
                </div>

              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nomor WhatsApp Anda</label>
                <input
                  type="text"
                  required
                  value={noHp}
                  onChange={(e) => setNoHp(e.target.value)}
                  placeholder="Contoh: 08123456789"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Deskripsi Produk & Keterangan</label>
                <textarea
                  required
                  rows={3}
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  placeholder="Tuliskan info porsi, rasa, jam operasional, atau jangkauan delivery gratis..."
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Submit */}
              <div className="flex gap-2 pt-2 border-t border-slate-100">
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
                  id="submit-product"
                >
                  Pasang Sekarang ✔️
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
