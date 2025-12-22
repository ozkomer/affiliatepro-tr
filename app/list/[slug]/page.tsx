'use client'

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
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
  ecommerceBrand: {
    id: string;
    name: string;
    logo: string | null;
    color: string | null;
  } | null;
  productUrls?: ProductUrl[];
}

interface CuratedList {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  youtubeUrl: string | null;
  isFeatured: boolean;
  category: {
    id: string;
    name: string;
  } | null;
  links: Array<{
    id: string;
    order: number;
    link: AffiliateLink | null;
  }>;
}

export default function ListDetails() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [list, setList] = useState<CuratedList | null>(null);
  const [profile, setProfile] = useState<{ youtubeUrl?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Base URL for affiliate links
  const baseUrl = typeof window !== 'undefined' 
    ? (process.env.NEXT_PUBLIC_BASE_URL || 'https://eneso.cc')
    : 'https://eneso.cc';

  useEffect(() => {
    if (slug) {
      fetchList();
      fetchProfile();
    }
  }, [slug]);

  const fetchList = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/lists/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setList(data);
      } else {
        console.error('Failed to fetch list:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching list:', error);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white font-system flex flex-col">
        <div className="flex justify-center py-5 px-5 flex-grow">
          <div className="w-full max-w-[400px] text-center">
            <div className="text-gray-400 py-20">Yükleniyor...</div>
          </div>
        </div>
        <ProfileHeader />
      </div>
    );
  }

  if (!list) {
    return (
      <div className="min-h-screen bg-white font-system flex flex-col">
        <div className="flex justify-center py-5 px-5 flex-grow">
          <div className="w-full max-w-[400px] text-center">
            <div className="text-gray-400 py-20">
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-4">Liste Bulunamadı</h2>
              <Link href="/" className="text-indigo-600 hover:underline">Ana Sayfaya Dön</Link>
            </div>
          </div>
        </div>
        <ProfileHeader />
      </div>
    );
  }

  // Filter and sort links
  const sortedLinks = list.links
    .filter(item => item.link !== null)
    .sort((a, b) => a.order - b.order);

  // Get primary product URLs for Amazon and Hepsiburada
  const getPrimaryUrls = (link: AffiliateLink) => {
    const amazonUrl = link.productUrls?.find(pu => 
      pu.ecommerceBrand.name.toLowerCase().includes('amazon')
    );
    const hepsiburadaUrl = link.productUrls?.find(pu => 
      pu.ecommerceBrand.name.toLowerCase().includes('hepsiburada')
    );
    return { amazonUrl, hepsiburadaUrl };
  };

  // Get YouTube embed URL
  const youtubeUrl = list.youtubeUrl || profile?.youtubeUrl;
  const embedUrl = youtubeUrl ? getYouTubeEmbedUrl(youtubeUrl) : null;

  return (
    <div className="min-h-screen bg-white font-system flex flex-col">
      <div className="flex justify-center py-5 px-5 flex-grow">
        <div className="w-full max-w-[400px] text-center">
          {/* Header Title */}
          <div className="text-[1.1rem] font-bold mb-6 text-[#1a1a1a] uppercase">
            {list.title}
          </div>

          {/* Product Grid */}
          <div className="flex flex-wrap gap-2.5 justify-center">
            {sortedLinks.length > 0 ? (
              sortedLinks.map((item) => {
                const link = item.link;
                if (!link) return null;

                const { amazonUrl, hepsiburadaUrl } = getPrimaryUrls(link);
                const hasUrls = amazonUrl || hepsiburadaUrl || (link.productUrls && link.productUrls.length > 0);

                return (
                  <Link
                    key={item.id}
                    href={`/product/${link.shortUrl}`}
                    className="w-[calc(50%-5px)] max-w-[180px] bg-white border border-[#ddd] rounded flex flex-col overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  >
                    {/* Image Container */}
                    <div className="w-full h-[130px] bg-white flex items-center justify-center p-2.5 box-border border-b border-[#f0f0f0]">
                      {link.imageUrl ? (
                        <img 
                          src={link.imageUrl} 
                          alt={link.title}
                          className="max-w-full max-h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-2.5 flex-grow flex flex-col justify-between text-center">
                      {/* Product Name */}
                      <div className="text-[13px] font-semibold text-[#333] mb-2 leading-[1.3] line-clamp-2">
                        {link.title}
                      </div>

                      {/* Store Buttons */}
                      {hasUrls && (
                        <div className="space-y-1" onClick={(e) => e.stopPropagation()}>
                          {amazonUrl && (
                            <a 
                              href={amazonUrl.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center justify-center bg-white border border-[#ddd] rounded p-1.5 mt-1 no-underline shadow-sm hover:shadow-md transition-shadow"
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
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center justify-center bg-white border border-[#ddd] rounded p-1.5 mt-1 no-underline shadow-sm hover:shadow-md transition-shadow"
                            >
                              <img 
                                src="https://upload.wikimedia.org/wikipedia/commons/2/20/Hepsiburada_logo_official.svg" 
                                alt="Hepsiburada"
                                className="h-6 w-auto"
                              />
                            </a>
                          )}
                          {/* Fallback: Show first 2 product URLs if Amazon/Hepsiburada not found */}
                          {!amazonUrl && !hepsiburadaUrl && link.productUrls && link.productUrls.length > 0 && (
                            <>
                              {link.productUrls.slice(0, 2).map((productUrl) => (
                                <a
                                  key={productUrl.id}
                                  href={productUrl.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="flex items-center justify-center bg-white border border-[#ddd] rounded p-1.5 mt-1 no-underline shadow-sm hover:shadow-md transition-shadow"
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
                      )}
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="w-full text-center py-20">
                <p className="text-gray-400">Bu listeye henüz ürün eklenmemiş.</p>
              </div>
            )}
          </div>

          {/* YouTube Video Section */}
          {embedUrl && (
            <div className="mb-6 mt-8">
              <div className="relative aspect-video w-full rounded overflow-hidden bg-black border border-[#ddd]">
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

          {/* Footer - Komisyon Yazısı */}
          <div className="text-[11px] text-[#aaa] mt-7.5 mb-5">
            *Linkler üzerinden yapacağınız alışverişlerden komisyon kazanırım.
          </div>
        </div>
      </div>

      {/* Profile Header - En Altta */}
      <ProfileHeader />
    </div>
  );
}
