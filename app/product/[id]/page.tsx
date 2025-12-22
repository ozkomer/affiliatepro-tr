'use client'

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { ProfileHeader } from '@/components/ProfileHeader';

interface UserProfile {
  telegramUrl?: string;
  whatsappUrl?: string;
  youtubeUrl?: string;
}

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
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Base URL for affiliate links
  const baseUrl = typeof window !== 'undefined' 
    ? (process.env.NEXT_PUBLIC_BASE_URL || 'https://eneso.cc')
    : 'https://eneso.cc';

  useEffect(() => {
    if (id) {
      fetchLink();
      fetchProfile();
    }
  }, [id]);

  // Update page title and meta tags when link is loaded
  useEffect(() => {
    if (link) {
      document.title = `${link.title} - Enes Özen`;
      
      // Update meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', link.description || `${link.title} - Enes Özen tarafından önerilen ürün`);
      
      // Update Open Graph tags
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute('content', `${link.title} - Enes Özen`);
      }
      
      const ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogDescription) {
        ogDescription.setAttribute('content', link.description || `${link.title} - Enes Özen tarafından önerilen ürün`);
      }
      
      if (link.imageUrl) {
        const ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage) {
          ogImage.setAttribute('content', link.imageUrl);
        }
      }
    } else {
      document.title = 'Ürün Detayı - Enes Özen';
    }
  }, [link]);

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

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
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

  // Get primary product URLs for Amazon and Hepsiburada
  const amazonUrl = link.productUrls?.find(pu => 
    pu.ecommerceBrand.name.toLowerCase().includes('amazon')
  );
  const hepsiburadaUrl = link.productUrls?.find(pu => 
    pu.ecommerceBrand.name.toLowerCase().includes('hepsiburada')
  );

  return (
    <div className="min-h-screen bg-white font-system flex justify-center py-5 px-5">
      <div className="w-full max-w-[400px] text-center">
        {/* Product Image */}
        {link.imageUrl ? (
          <img 
            src={link.imageUrl} 
            alt={link.title}
            className="w-full max-w-[150px] h-auto mx-auto mb-5"
          />
        ) : (
          <div className="w-full max-w-[150px] aspect-square mx-auto mb-5 bg-gray-100 flex items-center justify-center">
            <ExternalLink size={60} className="text-gray-400" />
          </div>
        )}

        {/* Product Title */}
        <h1 className="text-lg font-normal text-[#1a1a1a] mb-4 px-2.5">
          {link.title}
        </h1>

        {/* Product Description */}
        {link.description && (
          <div className="text-sm text-[#333] leading-6 mb-5 px-2.5">
            {link.description}
          </div>
        )}

        {/* Güncel Fiyat Yönlendirmesi */}
        <div className="text-[15px] text-[#1a1a1a] mb-3">
          Güncel Fiyatını Gör ↓
        </div>

        {/* Mağaza Butonları */}
        <div className="flex gap-2.5 justify-center mb-7.5">
          {amazonUrl && (
            <a 
              href={amazonUrl.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 bg-white border border-[#ddd] rounded p-3 no-underline shadow-sm flex items-center justify-center hover:shadow-md transition-shadow"
            >
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" 
                alt="Amazon"
                className="h-6 w-auto"
              />
            </a>
          )}
          {hepsiburadaUrl && (
            <a 
              href={hepsiburadaUrl.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 bg-white border border-[#ddd] rounded p-3 no-underline shadow-sm flex items-center justify-center hover:shadow-md transition-shadow"
            >
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/2/20/Hepsiburada_logo_official.svg" 
                alt="Hepsiburada"
                className="h-6 w-auto"
              />
            </a>
          )}
          {/* Fallback: Show all product URLs if Amazon/Hepsiburada not found */}
          {!amazonUrl && !hepsiburadaUrl && link.productUrls && link.productUrls.length > 0 && (
            <>
              {link.productUrls.slice(0, 2).map((productUrl) => (
                <a
                  key={productUrl.id}
                  href={productUrl.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-white border border-[#ddd] rounded p-3 no-underline shadow-sm flex items-center justify-center hover:shadow-md transition-shadow"
                >
                  {productUrl.ecommerceBrand.logo ? (
                    <img 
                      src={productUrl.ecommerceBrand.logo} 
                      alt={productUrl.ecommerceBrand.name}
                      className="h-6 w-auto"
                    />
                  ) : (
                    <span className="text-xs font-semibold">{productUrl.ecommerceBrand.name}</span>
                  )}
                </a>
              ))}
            </>
          )}
        </div>

        {/* YouTube Video Section */}
        {(link.youtubeUrl || profile?.youtubeUrl) && (
          <div className="bg-[#fcfcfc] border border-solid border-[#e0e0e0] p-5 px-4 mb-6 mt-8">
            <div className="font-bold text-sm text-[#333] mb-1">
              İnceleme Videosunu İzle
            </div>
            <div className="flex gap-2.5 mt-3">
              <a 
                href={link.youtubeUrl || profile?.youtubeUrl || '#'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 bg-white border border-[#ddd] rounded p-2.5 no-underline flex items-center justify-center hover:shadow-md transition-shadow"
              >
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg" 
                  width={24}
                  height={24}
                  alt="YouTube"
                  className="h-6 w-auto"
                />
              </a>
            </div>
          </div>
        )}

        {/* İndirim Kanalı Kutusu */}
        {(profile?.telegramUrl || profile?.whatsappUrl) && (
          <div className="bg-[#fcfcfc] border border-solid border-[#e0e0e0] p-5 px-4 mb-6 mt-8">
            <div className="font-bold text-sm text-[#333] mb-1">
              İndirim Kanalıma Katıl
            </div>
            <div className="text-xs text-[#777] mb-4">
              Anlık fırsatları yakala, kazançlı çık.
            </div>
            <div className="flex gap-2.5 mt-3">
              {profile.telegramUrl && (
                <a 
                  href={profile.telegramUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 bg-white border border-[#ddd] rounded p-2.5 no-underline flex items-center justify-center gap-1.5 text-[13px] font-semibold text-[#0088cc] hover:shadow-md transition-shadow"
                >
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg" 
                    width={18} 
                    height={18} 
                    alt="Telegram"
                  />
                  Telegram
                </a>
              )}
              {profile.whatsappUrl && (
                <a 
                  href={profile.whatsappUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 bg-white border border-[#ddd] rounded p-2.5 no-underline flex items-center justify-center gap-1.5 text-[13px] font-semibold text-[#25D366] hover:shadow-md transition-shadow"
                >
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
                    width={18} 
                    height={18} 
                    alt="WhatsApp"
                  />
                  WhatsApp
                </a>
              )}
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className="text-[11px] text-[#aaa] mt-2.5">
          *Linkler üzerinden yapacağınız alışverişlerden komisyon kazanırım.
        </div>
      </div>
    </div>
  );
}
