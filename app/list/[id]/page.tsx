'use client'

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Share2, Youtube } from 'lucide-react';
import { useStore } from '@/services/storage';
import { ProductCard } from '@/components/ProductCard';

export default function ListDetails() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { lists, products } = useStore();

  const list = lists.find(l => l.id === id);

  if (!list) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-bold text-gray-200 mb-4">Liste Bulunamadı</h2>
        <Link href="/lists" className="text-indigo-400 hover:underline">Listelere geri dön</Link>
      </div>
    );
  }

  // Filter products that belong to this list
  const listProducts = products.filter(p => list.productIds.includes(p.id));

  // Helper to get YouTube Embed URL
  const getYouTubeEmbedUrl = (url: string) => {
    try {
      let videoId = '';
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);

      if (match && match[2].length === 11) {
        videoId = match[2];
      } else {
        return null;
      }
      return `https://www.youtube.com/embed/${videoId}`;
    } catch (e) {
      return null;
    }
  };

  const embedUrl = list.youtubeUrl ? getYouTubeEmbedUrl(list.youtubeUrl) : null;

  return (
    <div className="pb-12">
      {/* Header */}
      <div className="bg-gray-900 text-white py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={list.coverImage || 'https://picsum.photos/1200/400'} 
            alt={list.title} 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center md:text-left">
          <Link href="/lists" className="inline-flex items-center text-gray-300 hover:text-white mb-6 transition-colors">
            <ArrowLeft size={20} className="mr-2" /> Listelere Dön
          </Link>
          <h1 className="text-2xl md:text-4xl font-bold mb-4 leading-tight">{list.title}</h1>
          <p className="text-lg text-gray-300 max-w-3xl leading-relaxed">{list.description}</p>
        </div>
      </div>

      {/* Content - Alan genişletildi (max-w-7xl) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-gray-800 rounded-xl shadow-xl p-4 md:p-8 border border-gray-700">
          <div className="flex items-center justify-between mb-8 border-b border-gray-700 pb-4">
            <span className="font-semibold text-gray-300">{listProducts.length} Ürün Listelendi</span>
            <button className="flex items-center gap-2 text-gray-400 hover:text-indigo-400 transition-colors text-sm">
              <Share2 size={16} /> Paylaş
            </button>
          </div>

          {/* List Layout - Changed to Grid (3 cols) with buttons underneath */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {listProducts.map((product, index) => (
              <div key={product.id} className="relative h-full">
                {/* Sıra numarası - Resim üzerine taşındı */}
                <div className="absolute top-3 left-3 z-10 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg border-2 border-gray-800">
                  {index + 1}
                </div>
                
                {/* Standart Grid Kartı Kullanıldı (Butonlar altta) */}
                <ProductCard product={product} variant="grid" />
              </div>
            ))}
          </div>

          {listProducts.length === 0 && (
            <div className="text-center py-12 bg-gray-700/50 rounded-lg">
              <p className="text-gray-400">Bu listeye henüz ürün eklenmemiş.</p>
            </div>
          )}
        </div>

        {/* Video Section */}
        {embedUrl && (
          <div className="mt-8 bg-gray-800 rounded-xl shadow-md border border-gray-700 overflow-hidden">
             <div className="p-6 border-b border-gray-700 bg-gray-700/50 flex items-center gap-2">
                <div className="p-2 bg-red-900/30 rounded-lg text-red-400">
                  <Youtube size={24} />
                </div>
                <div>
                   <h3 className="text-lg font-bold text-gray-100">İnceleme Videosu</h3>
                   <p className="text-sm text-gray-400">Bu liste ile ilgili detaylı incelemeyi izleyin.</p>
                </div>
             </div>
             
             <div className="p-4 md:p-6 bg-gray-900">
               <div className="relative aspect-video w-full rounded-lg overflow-hidden shadow-lg border border-gray-700 bg-black">
                 <iframe
                   src={embedUrl}
                   title="YouTube video player"
                   className="absolute top-0 left-0 w-full h-full"
                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                   allowFullScreen
                 ></iframe>
               </div>
             </div>
          </div>
        )}

      </div>
    </div>
  );
}

