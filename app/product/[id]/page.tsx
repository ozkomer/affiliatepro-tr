'use client'

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, ShoppingCart, Share2, Tag, Youtube } from 'lucide-react';
import { useStore } from '@/services/storage';
import { ProfileHeader } from '@/components/ProfileHeader';

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { products } = useStore();

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-200 mb-4">Ürün Bulunamadı</h2>
        <p className="text-gray-400 mb-6">Aradığınız ürün mevcut değil veya kaldırılmış olabilir.</p>
        <Link href="/" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
          Ana Sayfaya Dön
        </Link>
      </div>
    );
  }

  // Helper to get YouTube Embed URL
  const getYouTubeEmbedUrl = (url: string) => {
    try {
      // Handle different YouTube URL formats
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

  const embedUrl = product.youtubeUrl ? getYouTubeEmbedUrl(product.youtubeUrl) : null;

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Breadcrumb / Back Link */}
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-indigo-400 mb-4 transition-colors text-sm">
          <ArrowLeft size={18} className="mr-1.5" /> Geri Dön
        </Link>

        <div className="bg-gray-800 rounded-2xl shadow-sm border border-gray-700 overflow-hidden mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            
            {/* Image Section - Mobilde yükseklik sabitlendi (h-40) ve padding azaltıldı */}
            <div className="bg-gray-900 py-4 md:p-12 flex items-center justify-center">
               <div className="relative w-full max-w-lg h-40 md:h-auto md:aspect-square rounded-xl overflow-hidden bg-gray-800 shadow-sm border border-gray-700 mx-auto">
                  <img 
                    src={product.imageUrl || 'https://picsum.photos/600/600'} 
                    alt={product.title}
                    className="w-full h-full object-contain" 
                  />
               </div>
            </div>

            {/* Info Section - Mobilde padding azaltıldı */}
            <div className="p-4 md:p-12 flex flex-col h-full">
              <div className="flex items-center gap-2 mb-2 md:mb-4">
                 <span className="inline-flex items-center gap-1 bg-indigo-900/30 text-indigo-300 px-2.5 py-0.5 rounded-full text-xs md:text-sm font-medium">
                   <Tag size={12} className="md:w-3.5 md:h-3.5" /> {product.category}
                 </span>
              </div>

              <h1 className="text-xl md:text-3xl font-bold text-gray-100 mb-2 md:mb-4 leading-tight">
                {product.title}
              </h1>

              <div className="prose prose-indigo prose-sm md:prose-base text-gray-300 mb-4 md:mb-8 flex-grow">
                <p className="leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              {/* Affiliate Links Section */}
              <div className="mt-auto border-t border-gray-700 pt-4 md:pt-8">
                
                <div className="flex flex-col gap-2 md:gap-3">
                  {product.affiliateLinks && product.affiliateLinks.length > 0 ? (
                    product.affiliateLinks.map((link) => (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 md:px-6 md:py-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                      >
                        <div className="flex items-center gap-3 md:gap-4">
                          <div className="bg-white/20 p-1.5 md:p-2 rounded-lg">
                             {link.iconUrl ? (
                                <img src={link.iconUrl} alt="" className="w-5 h-5 md:w-6 md:h-6 object-contain" />
                             ) : (
                                <ShoppingCart size={20} className="md:w-6 md:h-6" />
                             )}
                          </div>
                          <span className="font-bold text-sm md:text-lg">{link.label} ile Satın Al</span>
                        </div>
                        <ExternalLink size={18} className="text-white/80 group-hover:text-white transition-colors md:w-5 md:h-5" />
                      </a>
                    ))
                  ) : (
                    <div className="text-center p-4 bg-gray-700/50 rounded-lg text-gray-400">
                      Şu an aktif satış linki bulunmuyor.
                    </div>
                  )}
                </div>

                {/* İşbirliği / Destek Metni */}
                <p className="text-[10px] md:text-xs text-gray-400 text-center mt-3 md:mt-4 italic leading-relaxed">
                  Ürün linkleri işbirliliği hazırlanmıştır. Linkleri kullanarak mobil uygulama üzerinden alırsanız bana destek olmuş olursunuz. Teşekkürler.
                </p>

              </div>
              
              <div className="mt-4 md:mt-6 flex justify-center">
                 <button className="text-gray-400 hover:text-gray-300 flex items-center gap-2 text-xs md:text-sm transition-colors">
                   <Share2 size={14} className="md:w-4 md:h-4" /> Bu ürünü paylaş
                 </button>
              </div>
            </div>
          </div>

          {/* Video Section */}
          {embedUrl && (
            <div className="border-t border-gray-700 bg-gray-700/30 p-4 md:p-12">
               <div className="flex items-center gap-2 mb-4 md:mb-6">
                  <div className="p-1.5 md:p-2 bg-red-900/30 rounded-lg text-red-400">
                    <Youtube size={20} className="md:w-6 md:h-6" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-100">İnceleme Videosu</h3>
               </div>
               
               <div className="max-w-4xl mx-auto">
                 <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-gray-700 bg-black">
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

      <ProfileHeader />
    </div>
  );
}

