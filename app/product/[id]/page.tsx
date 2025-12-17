'use client'

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, Share2, Tag, Youtube } from 'lucide-react';
import { ProfileHeader } from '@/components/ProfileHeader';

interface ProductUrl {
  id: string;
  url: string;
  isPrimary: boolean;
  order: number;
  ecommerceBrand: {
    id: string;
    name: string;
    logo: string | null;
    color: string | null;
  };
}

interface AffiliateLink {
  id: string;
  title: string;
  description: string | null;
  originalUrl: string | null;
  shortUrl: string;
  imageUrl: string | null;
  youtubeUrl: string | null;
  ecommerceBrand: {
    id: string;
    name: string;
    logo: string | null;
    color: string | null;
  } | null;
  category: {
    id: string;
    name: string;
  } | null;
  productUrls?: ProductUrl[];
}

export default function ProductDetail() {
  const params = useParams();
  const id = params.id as string;
  
  const [link, setLink] = useState<AffiliateLink | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Base URL for affiliate links
  const baseUrl = typeof window !== 'undefined' 
    ? (process.env.NEXT_PUBLIC_BASE_URL || 'https://eneso.cc')
    : 'https://eneso.cc';

  useEffect(() => {
    if (id) {
      fetchLink();
    }
  }, [id]);

  const fetchLink = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/links/${id}`);
      if (response.ok) {
        const data = await response.json();
        setLink(data);
      } else {
        console.error('Failed to fetch link:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching link:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 w-full py-20">
          <div className="text-center text-gray-400">Yükleniyor...</div>
        </div>
        <ProfileHeader />
      </div>
    );
  }

  if (!link) {
    return (
      <div className="min-h-screen bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 w-full py-20">
          <div className="text-center text-gray-400">
            <h2 className="text-2xl font-bold text-gray-200 mb-4">Ürün Bulunamadı</h2>
            <p className="text-gray-400 mb-6">Aradığınız ürün mevcut değil veya kaldırılmış olabilir.</p>
            <Link href="/" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
        <ProfileHeader />
      </div>
    );
  }

  // Helper to get YouTube Embed URL
  const getYouTubeEmbedUrl = (url: string) => {
    try {
      // Check if it's a playlist
      const playlistMatch = url.match(/[?&]list=([a-zA-Z0-9_-]+)/);
      if (playlistMatch) {
        return `https://www.youtube.com/embed/videoseries?list=${playlistMatch[1]}`;
      }

      // Check if it's a regular video
      let videoId = '';
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);

      if (match && match[2].length === 11) {
        videoId = match[2];
        return `https://www.youtube.com/embed/${videoId}`;
      }

      return null;
    } catch (e) {
      return null;
    }
  };

  const embedUrl = link.youtubeUrl ? getYouTubeEmbedUrl(link.youtubeUrl) : null;

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            
            {/* Image Section */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 py-8 md:p-12 flex items-center justify-center">
              <div className="relative w-full max-w-lg h-64 md:h-96 rounded-xl overflow-hidden bg-gray-800 shadow-lg border border-gray-700 mx-auto">
                {link.imageUrl ? (
                  <Image
                    src={link.imageUrl}
                    alt={link.title}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <ExternalLink size={80} />
                  </div>
                )}
              </div>
            </div>

            {/* Info Section */}
            <div className="p-6 md:p-12 flex flex-col h-full">
              {link.category && (
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center gap-1 bg-indigo-900/30 text-indigo-300 px-3 py-1 rounded-full text-sm font-medium">
                    <Tag size={14} /> {link.category.name}
                  </span>
                </div>
              )}

              <h1 className="text-2xl md:text-4xl font-bold text-white mb-4 leading-tight">
                {link.title}
              </h1>

              {link.description && (
                <div className="prose prose-invert prose-sm md:prose-base text-gray-300 mb-8 flex-grow">
                  <p className="leading-relaxed whitespace-pre-line">
                    {link.description}
                  </p>
                </div>
              )}

              {/* Affiliate Link Buttons */}
              <div className="mt-auto border-t border-gray-700 pt-6">
                {link.productUrls && link.productUrls.length > 0 ? (
                  <div className="space-y-3">
                    {link.productUrls.map((productUrl) => (
                      <a
                        key={productUrl.id}
                        href={productUrl.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/btn w-full text-white font-bold text-lg md:text-xl py-4 md:py-5 px-6 md:px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 transform hover:scale-[1.02]"
                        style={{
                          backgroundColor: productUrl.ecommerceBrand.color || '#6366f1',
                          ...(productUrl.ecommerceBrand.color ? {
                            background: `linear-gradient(to right, ${productUrl.ecommerceBrand.color}, ${productUrl.ecommerceBrand.color}dd)`,
                          } : {
                            background: 'linear-gradient(to right, #6366f1, #9333ea)',
                          })
                        }}
                        onMouseEnter={(e) => {
                          if (productUrl.ecommerceBrand.color) {
                            e.currentTarget.style.background = `linear-gradient(to right, ${productUrl.ecommerceBrand.color}dd, ${productUrl.ecommerceBrand.color}bb)`;
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (productUrl.ecommerceBrand.color) {
                            e.currentTarget.style.background = `linear-gradient(to right, ${productUrl.ecommerceBrand.color}, ${productUrl.ecommerceBrand.color}dd)`;
                          }
                        }}
                      >
                        {productUrl.ecommerceBrand.logo && (
                          <img 
                            src={productUrl.ecommerceBrand.logo} 
                            alt={productUrl.ecommerceBrand.name}
                            className="w-6 h-6 object-contain"
                          />
                        )}
                        <span>{productUrl.ecommerceBrand.name}'da Al</span>
                      </a>
                    ))}
                  </div>
                ) : link.ecommerceBrand ? (
                  <a
                    href={`${baseUrl}/${link.shortUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/btn w-full text-white font-bold text-lg md:text-xl py-4 md:py-5 px-6 md:px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 transform hover:scale-[1.02]"
                    style={{
                      backgroundColor: link.ecommerceBrand.color || '#6366f1',
                      ...(link.ecommerceBrand.color ? {
                        background: `linear-gradient(to right, ${link.ecommerceBrand.color}, ${link.ecommerceBrand.color}dd)`,
                      } : {
                        background: 'linear-gradient(to right, #6366f1, #9333ea)',
                      })
                    }}
                    onMouseEnter={(e) => {
                      if (link.ecommerceBrand?.color) {
                        e.currentTarget.style.background = `linear-gradient(to right, ${link.ecommerceBrand.color}dd, ${link.ecommerceBrand.color}bb)`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (link.ecommerceBrand?.color) {
                        e.currentTarget.style.background = `linear-gradient(to right, ${link.ecommerceBrand.color}, ${link.ecommerceBrand.color}dd)`;
                      }
                    }}
                  >
                    {link.ecommerceBrand.logo && (
                      <img 
                        src={link.ecommerceBrand.logo} 
                        alt={link.ecommerceBrand.name}
                        className="w-6 h-6 object-contain"
                      />
                    )}
                    <span>{link.ecommerceBrand.name}'da Al</span>
                  </a>
                ) : (
                  <a
                    href={`${baseUrl}/${link.shortUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/btn w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-lg md:text-xl py-4 md:py-5 px-6 md:px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 transform hover:scale-[1.02]"
                  >
                    <span>Satın Al</span>
                    <ExternalLink size={20} />
                  </a>
                )}

                {/* İşbirliği / Destek Metni */}
                <p className="text-xs text-gray-400 text-center mt-4 italic leading-relaxed">
                  Ürün linkleri işbirliliği hazırlanmıştır. Linkleri kullanarak mobil uygulama üzerinden alırsanız bana destek olmuş olursunuz. Teşekkürler.
                </p>
              </div>
              
              <div className="mt-6 flex justify-center">
                <button className="text-gray-400 hover:text-gray-300 flex items-center gap-2 text-sm transition-colors">
                  <Share2 size={16} /> Bu ürünü paylaş
                </button>
              </div>
            </div>
          </div>

          {/* Video Section */}
          {embedUrl && (
            <div className="border-t border-gray-700 bg-gray-900/50 p-6 md:p-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-red-600 rounded-xl text-white shadow-lg">
                  <Youtube size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">İnceleme Videosu</h3>
                  <p className="text-sm text-gray-300">Bu ürün ile ilgili detaylı incelemeyi izleyin.</p>
                </div>
              </div>
              
              <div className="max-w-4xl mx-auto">
                <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-2xl border-4 border-gray-700 bg-black">
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
