'use client'

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Layers } from 'lucide-react';
import { CuratedList, Product } from '@/types';

interface PreviewProduct {
  id: string;
  title: string;
  imageUrl: string | null;
}

interface CuratedListCardProps {
  list: CuratedList;
  productCount: number;
  previewProducts?: PreviewProduct[]; // Yeni özellik: Önizleme ürünleri
}

export const CuratedListCard: React.FC<CuratedListCardProps> = ({ list, productCount, previewProducts = [] }) => {
  return (
    <Link 
      href={`/list/${list.slug || list.id}`}
      className="group bg-white shadow-sm border border-[#ddd] overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
    >
      {/* Üst Taraf: Kapak Resmi - Kartın yarısını kaplayacak şekilde büyütüldü */}
      <div className="w-full h-64 relative overflow-hidden flex-shrink-0">
        <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-sm text-[#333] text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
            <Layers size={12} />
            {productCount} Ürün
        </div>
        {list.coverImage ? (
          <img
            src={list.coverImage}
            alt={list.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <Layers size={48} className="text-gray-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
        
        {/* Kategori Badge'i resmin üzerine alındı */}
        {list.category && (
             <span className="absolute bottom-3 left-3 text-xs font-bold text-white bg-indigo-600/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
               {list.category}
             </span>
        )}
      </div>

      {/* Alt Taraf: İçerik */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-4 flex-grow">
           <h3 className="text-xl font-bold text-[#1a1a1a] mb-2 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2">
             {list.title}
           </h3>
           <p className="text-gray-500 text-sm line-clamp-3">
             {list.description}
           </p>
        </div>

        {/* Alt Kısım: Ürün Önizlemeleri ve Buton */}
        <div className="pt-4 border-t border-[#ddd] mt-auto">
          <div className="flex items-center justify-between">
            <div className="flex -space-x-2">
              {previewProducts.slice(0, 4).map((prod) => (
                <div key={prod.id} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-white relative z-0 hover:z-10 transition-all shadow-sm" title={prod.title}>
                  {prod.imageUrl ? (
                    <img src={prod.imageUrl} alt={prod.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                      ?
                    </div>
                  )}
                </div>
              ))}
              {productCount > 4 && (
                <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 text-xs flex items-center justify-center font-bold border-2 border-white relative z-0 shadow-sm">
                  +{productCount - 4}
                </div>
              )}
            </div>
            
            <div className="flex items-center text-sm font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform">
               İncele <ArrowRight size={16} className="ml-1" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};