'use client'

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CuratedListCard } from '@/components/CuratedListCard';
import { Filter, Zap } from 'lucide-react';
import { ProfileHeader } from '@/components/ProfileHeader';
import { useStore } from '@/services/storage';

export default function ProductList() {
  const { lists, categories, products } = useStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCategory = searchParams.get('category');
  
  // Varsayılan kategori 'F/P Kulaklık' olarak ayarlandı
  const DEFAULT_CATEGORY = 'F/P Kulaklık';
  const [selectedCategory, setSelectedCategory] = useState<string>(DEFAULT_CATEGORY);

  // Update selected category if URL param changes
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    } else {
      setSelectedCategory(DEFAULT_CATEGORY);
    }
  }, [initialCategory]);

  // ARTIK ÜRÜNLERİ DEĞİL, LİSTELERİ FİLTRELİYORUZ
  const filteredLists = lists.filter(list => {
    return list.category === selectedCategory;
  });

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
                onClick={() => {
                  setSelectedCategory(category.name);
                  router.push(`/products?category=${encodeURIComponent(category.name)}`);
                }}
                className={`flex flex-col items-center justify-center min-w-[90px] p-2 rounded-xl border transition-all duration-200 group ${
                  selectedCategory === category.name 
                    ? 'bg-indigo-900/30 border-indigo-500 shadow-sm' 
                    : 'bg-gray-800 border-gray-700 hover:border-indigo-500 hover:bg-gray-700'
                }`}
              >
                <div className="w-10 h-10 rounded-full mb-2 overflow-hidden bg-gray-700 flex items-center justify-center shadow-sm">
                  {category.iconUrl ? (
                     <img src={category.iconUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                     <Zap size={20} className={`${selectedCategory === category.name ? 'text-indigo-400' : 'text-gray-500'}`} />
                  )}
                </div>
                <span className={`text-[11px] font-bold text-center truncate w-full px-1 ${selectedCategory === category.name ? 'text-indigo-300' : 'text-gray-300 group-hover:text-indigo-400'}`}>
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* LISTS Grid (Eskiden Product Grid idi) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredLists.length > 0 ? (
            filteredLists.map(list => {
              // Bu listeye ait ürünleri bul (Önizleme resmi için)
              const listProducts = products.filter(p => list.productIds.includes(p.id));
              
              return (
                <CuratedListCard 
                  key={list.id} 
                  list={list} 
                  productCount={list.productIds.length} 
                  previewProducts={listProducts} 
                />
              );
            })
          ) : (
            <div className="col-span-full text-center py-20 bg-gray-800 rounded-xl border border-dashed border-gray-700">
              <Filter size={48} className="mx-auto text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-200">Bu kategoride henüz liste oluşturulmamış</h3>
              <p className="text-gray-400 mt-2">Farklı bir kategori seçebilir veya yakında eklenecek listeleri bekleyebilirsiniz.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

