'use client'

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CuratedListCard } from '@/components/CuratedListCard';
import { Filter, Zap } from 'lucide-react';
import { ProfileHeader } from '@/components/ProfileHeader';

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
    };
  }>;
  createdAt: string;
  updatedAt: string;
}

function ProductListContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCategory = searchParams.get('category');
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch lists when category changes
  useEffect(() => {
    if (selectedCategoryId) {
      fetchLists(selectedCategoryId);
    } else if (categories.length > 0 && initialCategory) {
      // Find category by name
      const category = categories.find(c => c.name === initialCategory);
      if (category) {
        setSelectedCategory(category.name);
        setSelectedCategoryId(category.id);
        fetchLists(category.id);
      }
    } else if (categories.length > 0 && !initialCategory) {
      // Default to first category
      const firstCategory = categories[0];
      if (firstCategory) {
        setSelectedCategory(firstCategory.name);
        setSelectedCategoryId(firstCategory.id);
        fetchLists(firstCategory.id);
      }
    }
  }, [categories, initialCategory, selectedCategoryId]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        console.error('Failed to fetch categories:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLists = async (categoryId: string) => {
    try {
      const response = await fetch(`/api/lists?categoryId=${categoryId}`);
      if (response.ok) {
        const data = await response.json();
        setLists(data);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to fetch lists:', response.status, response.statusText, errorData);
        setLists([]); // Set empty array on error
      }
    } catch (error) {
      console.error('Error fetching lists:', error);
      setLists([]); // Set empty array on error
    }
  };

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category.name);
    setSelectedCategoryId(category.id);
    router.push(`/products?category=${encodeURIComponent(category.name)}`);
    fetchLists(category.id);
  };

  // Filter lists by selected category
  const filteredLists = lists.filter(list => {
    return list.categoryId === selectedCategoryId;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-white font-system">
        <ProfileHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="text-center py-20 text-gray-400">Yükleniyor...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-system">
      <ProfileHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        
        {/* Categories - Resimli/İkonlu Tasarım */}
        <div className="mb-8 overflow-hidden pt-2">
          <div className="flex overflow-x-auto gap-3 pb-4 no-scrollbar">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className={`flex flex-col items-center justify-center min-w-[90px] p-2 border transition-all duration-200 group ${
                  selectedCategory === category.name 
                    ? 'bg-indigo-100 border-indigo-500 shadow-sm' 
                    : 'bg-white border-[#ddd] hover:border-indigo-500 hover:bg-gray-100'
                }`}
              >
                <div className="w-10 h-10 rounded-full mb-2 overflow-hidden bg-white border border-[#ddd] flex items-center justify-center shadow-sm">
                  {category.imageUrl ? (
                     <img src={category.imageUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                     <div 
                       className="w-full h-full flex items-center justify-center text-white"
                       style={{ backgroundColor: category.color || '#6366f1' }}
                     >
                       {category.name.charAt(0).toUpperCase()}
                     </div>
                  )}
                </div>
                <span className={`text-[11px] font-bold text-center truncate w-full px-1 ${selectedCategory === category.name ? 'text-indigo-600' : 'text-[#333] group-hover:text-indigo-600'}`}>
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* LISTS Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredLists.length > 0 ? (
            filteredLists.map(list => {
              // Preview products from list links
              const previewProducts = list.links
                .slice(0, 4)
                .map(linkItem => ({
                  id: linkItem.link.id,
                  title: linkItem.link.title,
                  imageUrl: linkItem.link.imageUrl,
                }));
              
              return (
                <CuratedListCard 
                  key={list.id} 
                  list={{
                    id: list.id,
                    title: list.title,
                    slug: list.slug,
                    description: list.description || '',
                    productIds: list.links.map(l => l.link.id),
                    category: list.category?.name || '',
                    coverImage: list.coverImage || '',
                    youtubeUrl: list.youtubeUrl || undefined,
                    features: [],
                    isFeatured: list.isFeatured,
                    createdAt: new Date(list.createdAt).getTime(),
                  }} 
                  productCount={list.links.length} 
                  previewProducts={previewProducts} 
                />
              );
            })
          ) : (
            <div className="col-span-full text-center py-20 bg-white rounded-xl border border-dashed border-[#ddd]">
              <Filter size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-[#333]">Bu kategoride henüz liste oluşturulmamış</h3>
              <p className="text-gray-500 mt-2">Farklı bir kategori seçebilir veya yakında eklenecek listeleri bekleyebilirsiniz.</p>
            </div>
          )}
        </div>
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

