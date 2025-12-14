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
    <div className="pb-12">
      <ProfileHeader />
      
      {/* Header */}
      <div className="bg-gray-900 text-white py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0">
          {list.coverImage ? (
            <Image
              src={list.coverImage}
              alt={list.title}
              fill
              className="object-cover opacity-30"
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-gray-900"></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center md:text-left">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-gray-300 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" /> Geri Dön
          </button>
          <h1 className="text-2xl md:text-4xl font-bold mb-4 leading-tight">{list.title}</h1>
          {list.description && (
            <p className="text-lg text-gray-300 max-w-3xl leading-relaxed">{list.description}</p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-gray-800 rounded-xl shadow-xl p-4 md:p-8 border border-gray-700">
          <div className="flex items-center justify-between mb-8 border-b border-gray-700 pb-4">
            <span className="font-semibold text-gray-300">{sortedLinks.length} Ürün Listelendi</span>
            <button className="flex items-center gap-2 text-gray-400 hover:text-indigo-400 transition-colors text-sm">
              <Share2 size={16} /> Paylaş
            </button>
          </div>

          {/* List Layout - Grid (3 cols) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {sortedLinks.map((item, index) => {
              const link = item.link;
              if (!link) return null;

              return (
                <div key={item.id} className="group bg-gray-800 rounded-xl shadow-sm border border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                  {/* Resim */}
                  <div className="relative aspect-square overflow-hidden bg-gray-900 p-4 border-b border-gray-700">
                    <div className="absolute top-3 left-3 z-10 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg border-2 border-gray-800">
                      {index + 1}
                    </div>
                    {link.imageUrl ? (
                      <Image
                        src={link.imageUrl}
                        alt={link.title}
                        fill
                        className="object-contain group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                    ) : link.ecommerceBrand?.logo ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <Image
                          src={link.ecommerceBrand.logo}
                          alt={link.ecommerceBrand.name}
                          width={200}
                          height={200}
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600">
                        <ShoppingCart size={48} />
                      </div>
                    )}
                  </div>
                  
                  {/* İçerik */}
                  <div className="flex flex-col flex-grow p-5">
                    <h3 className="font-semibold text-gray-100 text-lg mb-2 line-clamp-2 group-hover:text-indigo-400 transition-colors">
                      {link.title}
                    </h3>
                    
                    {link.description && (
                      <p className="text-sm text-gray-400 line-clamp-3 mb-6 flex-grow">
                        {link.description}
                      </p>
                    )}
                    
                    {/* Affiliate Link Butonu */}
                    <div className="mt-auto border-t border-gray-700 pt-4">
                      <a
                        href={`${baseUrl}/l/${link.shortUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between w-full bg-indigo-900/30 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded-lg transition-all duration-300 group/btn px-4 py-2.5 text-sm"
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          {link.ecommerceBrand?.logo ? (
                            <Image
                              src={link.ecommerceBrand.logo}
                              alt={link.ecommerceBrand.name}
                              width={20}
                              height={20}
                              className="object-contain rounded-sm flex-shrink-0"
                              unoptimized
                            />
                          ) : (
                            <ShoppingCart size={18} className="flex-shrink-0" />
                          )}
                          <span className="font-medium truncate">
                            {link.ecommerceBrand?.name || 'Satın Al'}
                          </span>
                        </div>
                        <ExternalLink size={16} className="opacity-70 group-hover/btn:opacity-100 flex-shrink-0" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {sortedLinks.length === 0 && (
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

