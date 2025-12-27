'use client'

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

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

interface ListUrl {
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

interface CuratedList {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  youtubeUrl: string | null;
  isFeatured: boolean;
  showDirectLinks: boolean;
  category: {
    id: string;
    name: string;
  } | null;
  links: Array<{
    id: string;
    order: number;
    link: AffiliateLink | null;
  }>;
  listUrls?: ListUrl[];
}

export default function ListDetails() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [list, setList] = useState<CuratedList | null>(null);
  const [profile, setProfile] = useState<{ youtubeUrl?: string; telegramUrl?: string; whatsappUrl?: string } | null>(null);
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
      <div className="min-h-screen bg-white font-system flex justify-center items-center py-5 px-5">
        <div className="flex flex-col items-center justify-center">
          {/* Eski Mac tarzı loading spinner */}
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-2 border-gray-200 rounded-full"></div>
            <div className="absolute inset-0 border-2 border-transparent border-t-[#1a1a1a] rounded-full animate-spin" style={{ animationDuration: '0.8s' }}></div>
          </div>
        </div>
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
      </div>
    );
  }

  // Filter and sort links
  const sortedLinks = list.links
    .filter(item => item.link !== null)
    .sort((a, b) => a.order - b.order);

  // Get primary list URLs for Amazon and Hepsiburada
  const getPrimaryListUrls = () => {
    if (!list.listUrls || list.listUrls.length === 0) return { amazonUrl: null, hepsiburadaUrl: null };
    const amazonUrl = list.listUrls.find(lu => 
      lu.ecommerceBrand.name.toLowerCase().includes('amazon')
    );
    const hepsiburadaUrl = list.listUrls.find(lu => 
      lu.ecommerceBrand.name.toLowerCase().includes('hepsiburada')
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

          {/* List Cover Image */}
          {list.coverImage && (
            <div className="mb-6">
              <img 
                src={list.coverImage} 
                alt={list.title}
                className="w-full max-w-[300px] h-auto mx-auto"
              />
            </div>
          )}

          {/* List Description */}
          {list.description && (
            <div className="text-sm text-[#333] leading-6 mb-5 px-2.5">
              {list.description}
            </div>
          )}

          {/* List Direct Links OR Product Grid - Based on showDirectLinks flag */}
          {list.showDirectLinks && list.listUrls && list.listUrls.length > 0 ? (
            // Show New Design for List Links (showDirectLinks: true)
            <div className="w-full">
              {/* Update Badge */}
              <div className="flex justify-center mb-2.5">
                <div className="inline-flex items-center gap-1.5 bg-[#e6f4ea] text-[#1e8e3e] px-3 py-1.5 text-xs font-bold shadow-sm">
                  <span className="w-2 h-2 bg-[#1e8e3e] rounded-full animate-pulse-dot"></span>
                  Liste Güncellendi
                </div>
              </div>

              {/* Main List Button - Links to list URLs */}
              <div className="mb-10">
                {(() => {
                  const { amazonUrl, hepsiburadaUrl } = getPrimaryListUrls();
                  const primaryUrl = amazonUrl || hepsiburadaUrl || (list.listUrls && list.listUrls[0]);
                  
                  if (primaryUrl) {
                    const handleListClick = async (e: React.MouseEvent) => {
                      e.preventDefault();
                      
                      console.log('🔵 List click handler triggered');
                      console.log('🔵 Slug:', slug);
                      console.log('🔵 Primary URL:', primaryUrl);
                      console.log('🔵 List URL ID:', primaryUrl.id);
                      
                      // Track click - use slug from URL params, not list.slug
                      try {
                        const clickUrl = `/api/lists/${slug}/click`;
                        console.log('🔵 Calling API:', clickUrl);
                        
                        const response = await fetch(clickUrl, {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            listUrlId: primaryUrl.id,
                          }),
                        });
                        
                        console.log('🔵 Response status:', response.status);
                        const responseData = await response.json();
                        console.log('🔵 Response data:', responseData);
                        
                        if (!response.ok) {
                          console.error('❌ Error tracking list click:', responseData);
                        } else {
                          console.log('✅ Click tracked successfully');
                        }
                      } catch (error) {
                        console.error('❌ Error tracking list click:', error);
                      }
                      
                      // Open URL
                      window.open(primaryUrl.url, '_blank', 'noopener,noreferrer');
                    };
                    
                    return (
                      <a 
                        href={primaryUrl.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleListClick}
                        className="flex items-center justify-between px-6 w-full h-[70px] bg-white border-2 border-[#e6f4ea] no-underline shadow-md transition-all active:scale-[0.98]"
                      >
                        <span className="text-[17px] font-bold text-[#1a1a1a]">Tüm Listeyi İncele</span>
                        <span className="text-2xl text-[#1e8e3e] font-light">›</span>
                      </a>
                    );
                  }
                  return null;
                })()}
              </div>

              {/* Discount Area */}
              <div className="border border-dashed border-[#ddd] p-5 rounded bg-[#fafafa] mb-10">
                <div className="text-sm font-bold text-[#333] mb-1">
                  İndirim Kanalıma Katıl 🚀
                </div>
                <div className="text-xs text-[#777] mb-4">
                  Anlık fırsatları yakala, kazançlı çık.
                </div>
                <div className="flex gap-2.5">
                  {profile?.telegramUrl && (
                    <a 
                      href={profile.telegramUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 h-11 bg-white border border-[#e0e0e0] rounded no-underline font-semibold text-[13px] shadow-sm hover:shadow-md transition-shadow"
                      style={{ color: '#0088cc' }}
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
                  {profile?.whatsappUrl && (
                    <a 
                      href={profile.whatsappUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 h-11 bg-white border border-[#e0e0e0] rounded no-underline font-semibold text-[13px] shadow-sm hover:shadow-md transition-shadow"
                      style={{ color: '#25D366' }}
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
            </div>
          ) : (
            // Show Product Grid for Product Lists (showDirectLinks: false)
            <div className="flex flex-wrap gap-2.5 justify-center">
            {sortedLinks.length > 0 ? (
              sortedLinks.map((item) => {
                const link = item.link;
                if (!link) return null;

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
                      {link.productUrls && link.productUrls.length > 0 && (
                        <div className="grid grid-cols-2 gap-1" onClick={(e) => e.stopPropagation()}>
                          {link.productUrls.map((productUrl) => {
                            const brandName = productUrl.ecommerceBrand.name.toLowerCase();
                            const isAmazon = brandName.includes('amazon');
                            const isHepsiburada = brandName.includes('hepsiburada');
                            
                            return (
                              <a
                                key={productUrl.id}
                                href={productUrl.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center justify-center bg-white border border-[#ddd] rounded p-1.5 no-underline shadow-sm hover:shadow-md transition-shadow"
                              >
                                {isAmazon ? (
                                  <img 
                                    src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" 
                                    alt="Amazon"
                                    className="h-6 w-auto"
                                  />
                                ) : isHepsiburada ? (
                                  <img 
                                    src="https://upload.wikimedia.org/wikipedia/commons/2/20/Hepsiburada_logo_official.svg" 
                                    alt="Hepsiburada"
                                    className="h-6 w-auto"
                                  />
                                ) : productUrl.ecommerceBrand.logo ? (
                                  <img 
                                    src={productUrl.ecommerceBrand.logo} 
                                    alt={productUrl.ecommerceBrand.name}
                                    className="h-6 w-auto"
                                  />
                                ) : (
                                  <span className="text-xs font-semibold">{productUrl.ecommerceBrand.name}</span>
                                )}
                              </a>
                            );
                          })}
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
          )}

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
    </div>
  );
}
