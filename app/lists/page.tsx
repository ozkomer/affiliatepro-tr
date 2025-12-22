'use client'

import React, { useEffect, useState } from 'react';
import { CuratedListCard } from '@/components/CuratedListCard';
import { ProfileHeader } from '@/components/ProfileHeader';

interface List {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  youtubeUrl: string | null;
  isFeatured: boolean;
  showDirectLinks: boolean;
  categoryId: string | null;
  category: {
    id: string;
    name: string;
  } | null;
  links: Array<{
    id: string;
    link: {
      id: string;
      title: string;
      imageUrl: string | null;
    } | null;
  }>;
  createdAt: string;
  updatedAt: string;
}

export default function AllLists() {
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const response = await fetch('/api/lists');
      if (response.ok) {
        const data = await response.json();
        setLists(data);
      } else {
        console.error('Failed to fetch lists:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching lists:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-system">
      <ProfileHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl font-bold text-[#1a1a1a]">Özel Listeler</h1>
          <p className="text-gray-500 mt-2 text-lg">Konuya göre derlediğimiz en iyi ürün koleksiyonları.</p>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-12">Yükleniyor...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {lists.map(list => {
              const productCount = list.links.filter(l => l.link !== null).length;
              const previewProducts = list.links
                .filter(l => l.link !== null)
                .slice(0, 4)
                .map(l => ({
                  id: l.link!.id,
                  title: l.link!.title,
                  description: '',
                  affiliateLinks: [],
                  category: list.category?.name || '',
                  imageUrl: l.link!.imageUrl || '',
                  createdAt: Date.now(),
                }));

              return (
                <CuratedListCard 
                  key={list.id} 
                  list={{
                    id: list.id,
                    title: list.title,
                    slug: list.slug,
                    description: list.description || '',
                    productIds: list.links.filter(l => l.link !== null).map(l => l.link!.id),
                    category: list.category?.name,
                    coverImage: list.coverImage || undefined,
                    youtubeUrl: list.youtubeUrl || undefined,
                    isFeatured: list.isFeatured,
                    showDirectLinks: list.showDirectLinks,
                    createdAt: new Date(list.createdAt).getTime(),
                  }}
                  productCount={productCount}
                  previewProducts={previewProducts}
                />
              );
            })}
            {lists.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl border border-dashed border-[#ddd]">
                Henüz liste bulunmamaktadır.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

