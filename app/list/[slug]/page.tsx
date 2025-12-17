'use client'

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Share2, Youtube, ExternalLink, ShoppingCart } from 'lucide-react';
import { ProfileHeader } from '@/components/ProfileHeader';

interface AffiliateLink {
  id: string;
  title: string;
  description: string | null;
  originalUrl: string;
  shortUrl: string;
  imageUrl: string | null;
  ecommerceBrand: {
    id: string;
    name: string;
    logo: string | null;
    color: string | null;
  } | null;
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
  const router = useRouter();
  const slug = params.slug as string;
  
  const [list, setList] = useState<CuratedList | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Base URL for affiliate links
  const baseUrl = typeof window !== 'undefined' 
    ? (process.env.NEXT_PUBLIC_BASE_URL || 'https://eneso.cc')
    : 'https://eneso.cc';

  useEffect(() => {
    if (slug) {
      fetchList();
    }
  }, [slug]);

  const fetchList = async () => {
    try {
      setLoading(true);
      console.log('Fetching list with slug:', slug);
      const response = await fetch(`/api/lists/${slug}`);
      if (response.ok) {
        const data = await response.json();
        console.log('List data received:', data);
        setList(data);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to fetch list:', response.statusText, errorData);
      }
    } catch (error) {
      console.error('Error fetching list:', error);
    } finally {
      setLoading(false);
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
      <div className="flex flex-col gap-6 pb-12">
        <ProfileHeader />
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="text-center text-gray-400 py-20">Yükleniyor...</div>
        </div>
      </div>
    );
  }

  if (!list) {
    return (
      <div className="flex flex-col gap-6 pb-12">
        <ProfileHeader />
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="text-center text-gray-400 py-20">
            <h2 className="text-2xl font-bold text-gray-200 mb-4">Liste Bulunamadı</h2>
            <Link href="/" className="text-indigo-400 hover:underline">Ana Sayfaya Dön</Link>
          </div>
        </div>
      </div>
    );
  }

  // Filter and sort links
  const sortedLinks = list.links
    .filter(item => item.link !== null)
    .sort((a, b) => a.order - b.order);

  const embedUrl = list.youtubeUrl ? getYouTubeEmbedUrl(list.youtubeUrl) : null;

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section - Geni.us Style */}
      <div className="bg-gradient-to-b from-gray-900 to-gray-950 text-white py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">{list.title}</h1>
          {list.description && (
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-6">
              {list.description}
            </p>
          )}
          {list.category && (
            <span className="inline-block px-4 py-2 bg-indigo-600/20 text-indigo-300 rounded-full text-sm font-semibold border border-indigo-500/30">
              {list.category.name}
            </span>
          )}
        </div>
      </div>

      {/* Products Section - Geni.us Style */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {sortedLinks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {sortedLinks.map((item, index) => {
              const link = item.link;
              if (!link) return null;

              return (
                <div key={item.id} className="group flex flex-col h-full">
                  {/* Product Card - Geni.us Style */}
                  <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700 hover:shadow-3xl hover:border-gray-600 transition-all duration-500 flex flex-col h-full">
                    {/* Product Image - Large and Centered - Clickable */}
                    <Link 
                      href={`/product/${link.shortUrl}`}
                      className="relative w-full h-48 md:h-64 bg-gradient-to-br from-gray-900 to-gray-800 p-4 md:p-8 flex items-center justify-center cursor-pointer"
                    >
                      {link.imageUrl ? (
                        <div className="relative w-full h-full max-w-md mx-auto">
                          <Image
                            src={link.imageUrl}
                            alt={link.title}
                            fill
                            className="object-contain group-hover:scale-105 transition-transform duration-700"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          <ShoppingCart size={80} />
                        </div>
                      )}
                    </Link>
                    
                    {/* Product Content */}
                    <div className="p-4 md:p-6 bg-gray-800 flex flex-col flex-grow">
                      <Link href={`/product/${link.shortUrl}`}>
                        <h2 className="text-lg md:text-xl font-bold text-white mb-2 leading-tight line-clamp-2 hover:text-indigo-400 transition-colors cursor-pointer">
                          {link.title}
                        </h2>
                      </Link>
                      
                      {link.description && (
                        <p className="text-gray-300 text-sm md:text-base mb-4 leading-relaxed line-clamp-3 flex-grow">
                          {link.description}
                        </p>
                      )}
                      
                      {/* Get it now Button - Geni.us Style */}
                      <div className="mt-auto">
                        <a
                          href={`${baseUrl}/${link.shortUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/btn w-full text-white font-bold text-sm md:text-base py-3 md:py-4 px-4 md:px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-[1.02]"
                          style={{
                            backgroundColor: link.ecommerceBrand?.color || '#6366f1',
                            ...(link.ecommerceBrand?.color ? {
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
                          <span>
                            {link.ecommerceBrand 
                              ? link.ecommerceBrand.name
                              : 'Satın Al'
                            }
                          </span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-800 rounded-2xl shadow-lg border border-gray-700">
            <p className="text-gray-400 text-lg">Bu listeye henüz ürün eklenmemiş.</p>
          </div>
        )}

        {/* Video Section - Show after products if available */}
        {embedUrl && (
          <div className="mt-16">
            <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 overflow-hidden">
               <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-red-900/20 to-orange-900/20 flex items-center gap-3">
                  <div className="p-3 bg-red-600 rounded-xl text-white shadow-lg">
                    <Youtube size={28} />
                  </div>
                  <div>
                     <h3 className="text-xl font-bold text-white">İnceleme Videosu</h3>
                     <p className="text-sm text-gray-300">Bu liste ile ilgili detaylı incelemeyi izleyin.</p>
                  </div>
               </div>
               
               <div className="p-6 bg-gray-900">
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
          </div>
        )}
      </div>
      
      <ProfileHeader />
    </div>
  );
}

