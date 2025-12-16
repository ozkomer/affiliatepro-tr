'use client'

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Filter } from 'lucide-react';
import { ProfileHeader } from '@/components/ProfileHeader';
import { CuratedListCard } from '@/components/CuratedListCard';

interface Category {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  imageUrl: string | null;
}

interface CuratedList {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  youtubeUrl: string | null;
  isFeatured: boolean;
  categoryId: string;
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
}

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;
  
  const [category, setCategory] = useState<Category | null>(null);
  const [lists, setLists] = useState<CuratedList[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (categoryId) {
      fetchCategoryData();
    }
  }, [categoryId]);

  const fetchCategoryData = async () => {
    try {
      setLoading(true);
      
      // Kategori bilgilerini çek
      const categoryResponse = await fetch(`/api/categories/${categoryId}`);
      if (categoryResponse.ok) {
        const categoryData = await categoryResponse.json();
        setCategory(categoryData);
      } else {
        console.error('Failed to fetch category:', categoryResponse.statusText);
        router.push('/');
        return;
      }

      // Kategoriye ait listeleri çek
      const listsResponse = await fetch(`/api/lists?categoryId=${categoryId}`);
      if (listsResponse.ok) {
        const listsData = await listsResponse.json();
        setLists(listsData);
      } else {
        const errorData = await listsResponse.json().catch(() => ({}));
        console.error('Failed to fetch lists:', listsResponse.statusText, errorData);
      }
    } catch (error) {
      console.error('Error fetching category data:', error);
    } finally {
      setLoading(false);
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

  if (!category) {
    return (
      <div className="flex flex-col gap-6 pb-12">
        <ProfileHeader />
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="text-center text-gray-400 py-20">Kategori bulunamadı.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-12">
      <ProfileHeader />

      <div className="max-w-7xl mx-auto px-4 w-full">
        {/* Geri Dön Butonu */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-200 transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          <span>Geri Dön</span>
        </button>

        {/* Kategori Başlığı */}
        <div className="flex items-center gap-4 mb-8">
          {category.imageUrl ? (
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-700 border border-gray-600 flex items-center justify-center flex-shrink-0">
              <Image
                src={category.imageUrl}
                alt={category.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0"
              style={{ backgroundColor: category.color || '#6366f1' }}
            >
              {category.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-100 mb-2">{category.name}</h1>
            {category.description && (
              <p className="text-gray-400">{category.description}</p>
            )}
          </div>
        </div>

        {/* Listeler Grid */}
        {lists.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {lists.map((list) => {
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
                    slug: list.slug,
                    title: list.title,
                    description: list.description || '',
                    productIds: list.links.filter(l => l.link !== null).map(l => l.link!.id),
                    coverImage: list.coverImage || undefined,
                    youtubeUrl: list.youtubeUrl || undefined,
                    category: list.category?.name,
                    isFeatured: list.isFeatured,
                    createdAt: Date.now(),
                  }}
                  productCount={productCount}
                  previewProducts={previewProducts}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-800 rounded-xl border border-dashed border-gray-700">
            <Filter size={48} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-200">Bu kategoride henüz liste oluşturulmamış</h3>
            <p className="text-gray-400 mt-2">Yakında eklenecek listeleri bekleyebilirsiniz.</p>
          </div>
        )}
      </div>
    </div>
  );
}

