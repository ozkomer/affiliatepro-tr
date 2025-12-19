'use client'

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
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
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 w-full py-20">
          <div className="text-center text-gray-400">Yükleniyor...</div>
        </div>
        <ProfileHeader />
      </div>
    );
  }

  if (!link) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 w-full py-20">
          <div className="text-center text-gray-400">
            <h2 className="text-2xl font-bold text-white mb-4">Ürün Bulunamadı</h2>
            <p className="text-gray-300 mb-6">Aradığınız ürün mevcut değil veya kaldırılmış olabilir.</p>
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
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: link.imageUrl ? `url(${link.imageUrl})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Overlay for better content readability */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Product Image */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-full max-w-xl overflow-hidden rounded-lg shadow-2xl bg-white/10 backdrop-blur-sm">
            {link.imageUrl ? (
              <div className="relative w-full" style={{ aspectRatio: 'auto' }}>
                <Image
                  src={link.imageUrl}
                  alt={link.title}
                  width={800}
                  height={800}
                  className="w-full h-auto object-contain"
                  unoptimized
                  style={{ maxHeight: '70vh' }}
                />
              </div>
            ) : (
              <div className="w-full aspect-square flex items-center justify-center text-gray-400 bg-white/10 backdrop-blur-sm">
                <ExternalLink size={80} />
              </div>
            )}
          </div>
        </div>

        {/* Product Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
          {link.title}
        </h1>

        {/* Get it now Section */}
        <div className="text-center mb-6">
          <p className="text-lg font-semibold text-white mb-4">Şimdi Al:</p>
          
          {/* Affiliate Link Buttons */}
          {link.productUrls && link.productUrls.length > 0 ? (
            <div className="space-y-3 max-w-md mx-auto">
              {link.productUrls.map((productUrl) => (
                <a
                  key={productUrl.id}
                  href={productUrl.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group/btn w-full text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center transform hover:scale-[1.02] ${
                    productUrl.ecommerceBrand.logo 
                      ? 'p-0 overflow-hidden h-16' 
                      : 'text-base md:text-lg py-4 px-6 gap-3'
                  }`}
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
                  {productUrl.ecommerceBrand.logo ? (
                    <img 
                      src={productUrl.ecommerceBrand.logo} 
                      alt={productUrl.ecommerceBrand.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{productUrl.ecommerceBrand.name}'da Al</span>
                  )}
                </a>
              ))}
            </div>
          ) : link.ecommerceBrand ? (
            <a
              href={`${baseUrl}/${link.shortUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`group/btn w-full max-w-md mx-auto text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center transform hover:scale-[1.02] ${
                link.ecommerceBrand.logo 
                  ? 'p-0 overflow-hidden h-16' 
                  : 'text-base md:text-lg py-4 px-6 gap-3'
              }`}
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
              {link.ecommerceBrand.logo ? (
                <img 
                  src={link.ecommerceBrand.logo} 
                  alt={link.ecommerceBrand.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{link.ecommerceBrand.name}'da Al</span>
              )}
            </a>
          ) : (
            <a
              href={`${baseUrl}/${link.shortUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn w-full max-w-md mx-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-base md:text-lg py-4 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-3 transform hover:scale-[1.02]"
            >
              <span>Satın Al</span>
            </a>
          )}
        </div>

        {/* Affiliate Disclosure */}
        <p className="text-sm text-gray-300 text-center mb-8">
          Hepsiburada ve diğer perakendecilerden yapılan uygun satın alımlardan komisyon kazanabiliriz.
        </p>

        {/* Video Section */}
        {embedUrl && (
          <div className="mt-12 max-w-3xl mx-auto">
            <div className="relative aspect-video w-full rounded-lg overflow-hidden shadow-lg border border-white/20 bg-black">
              <iframe
                src={embedUrl}
                title="YouTube video player"
                className="absolute top-0 left-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
      </div>
      
      <div className="relative z-10">
        <ProfileHeader />
      </div>
    </div>
  );
}
