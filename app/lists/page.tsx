'use client'

import React from 'react';
import { useStore } from '@/services/storage';
import { CuratedListCard } from '@/components/CuratedListCard';
import { ProfileHeader } from '@/components/ProfileHeader';

export default function AllLists() {
  const { lists, products } = useStore();

  return (
    <div>
      <ProfileHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-100">Özel Listeler</h1>
          <p className="text-gray-400 mt-2 text-lg">Konuya göre derlediğimiz en iyi ürün koleksiyonları.</p>
        </div>

        {/* Grid güncellendi: Mobilde 1, Tablette 2, Geniş ekranda 4 sütun */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {lists.map(list => {
            // Bu listeye ait ürünleri bul
            const listProducts = products.filter(p => list.productIds.includes(p.id));
            
            return (
              <CuratedListCard 
                key={list.id} 
                list={list} 
                productCount={list.productIds.length} 
                previewProducts={listProducts} 
              />
            );
          })}
          {lists.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-400 bg-gray-800 rounded-xl border border-dashed border-gray-700">
              Henüz liste bulunmamaktadır.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

