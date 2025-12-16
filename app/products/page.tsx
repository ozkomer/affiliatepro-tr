'use client'

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CuratedListCard } from '@/components/CuratedListCard';
import { Filter, Zap } from 'lucide-react';
import { ProfileHeader } from '@/components/ProfileHeader';
import Image from 'next/image';

interface Category {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  imageUrl: string | null;
}

interface List {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  youtubeUrl: string | null;
  isFeatured: boolean;
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

function ProductListContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCategoryId = searchParams.get('categoryId');
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [lists, setLists] = useState<List[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(initialCategoryId);
  const [loading, setLoading] = useState(true);
  const [listsLoading, setListsLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategoryId) {
      fetchLists(selectedCategoryId);
    } else if (categories.length > 0) {
      // İlk kategoriyi varsayılan olarak seç
      setSelectedCategoryId(categories[0].id);
      fetchLists(categories[0].id);
    }
  }, [selectedCategoryId, categories]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        // "Özel Listeler" kategorisini filtrele
        const filteredCategories = data.filter((cat: Category) => 
          cat.name.toLowerCase() !== 'özel listeler'
        );
        setCategories(filteredCategories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLists = async (categoryId: string) => {
    try {
      setListsLoading(true);
      const response = await fetch(`/api/lists?categoryId=${categoryId}`);
      if (response.ok) {
        const data = await response.json();
        setLists(data);
      }
    } catch (error) {
      console.error('Error fetching lists:', error);
    } finally {
      setListsLoading(false);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    router.push(`/products?categoryId=${categoryId}`);
  };

  if (loading) {
    return (
      <div>
        <ProfileHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="text-center text-gray-400 py-20">Yükleniyor...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ProfileHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        
        {/* Categories - Resimli/İkonlu Tasarım */}
        <div className="mb-8 overflow-hidden pt-2">
          <div className="flex overflow-x-auto gap-3 pb-4 no-scrollbar">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`flex flex-col items-center justify-center min-w-[90px] p-2 rounded-xl border transition-all duration-200 group ${
                  selectedCategoryId === category.id 
                    ? 'bg-indigo-900/30 border-indigo-500 shadow-sm' 
                    : 'bg-gray-800 border-gray-700 hover:border-indigo-500 hover:bg-gray-700'
                }`}
              >
                <div className="w-10 h-10 rounded-full mb-2 overflow-hidden bg-gray-700 flex items-center justify-center shadow-sm">
                  {category.imageUrl ? (
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div 
                      className="w-full h-full flex items-center justify-center text-white"
                      style={{ backgroundColor: category.color || '#6366f1' }}
                    >
                      {category.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <span className={`text-[11px] font-bold text-center truncate w-full px-1 ${selectedCategoryId === category.id ? 'text-indigo-300' : 'text-gray-300 group-hover:text-indigo-400'}`}>
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* LISTS Grid */}
        {listsLoading ? (
          <div className="text-center text-gray-400 py-20">Listeler yükleniyor...</div>
        ) : lists.length > 0 ? (
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
                    slug: list.slug,
                    title: list.title,
                    description: list.description || '',
                    productIds: list.links.filter(l => l.link !== null).map(l => l.link!.id),
                    coverImage: list.coverImage || undefined,
                    youtubeUrl: list.youtubeUrl || undefined,
                    category: list.category?.name,
                    isFeatured: list.isFeatured,
                    createdAt: new Date(list.createdAt).getTime(),
                  }}
                  productCount={productCount}
                  previewProducts={previewProducts}
                />
              );
            })}
          </div>
        ) : (
          <div className="col-span-full text-center py-20 bg-gray-800 rounded-xl border border-dashed border-gray-700">
            <Filter size={48} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-200">Bu kategoride henüz liste oluşturulmamış</h3>
            <p className="text-gray-400 mt-2">Farklı bir kategori seçebilir veya yakında eklenecek listeleri bekleyebilirsiniz.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductList() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-400">Yükleniyor...</div>}>
      <ProductListContent />
    </Suspense>
  );
}

