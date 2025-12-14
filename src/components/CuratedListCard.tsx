import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers } from 'lucide-react';
import { CuratedList, Product } from '../types';

interface CuratedListCardProps {
  list: CuratedList;
  productCount: number;
  previewProducts?: Product[]; // Yeni özellik: Önizleme ürünleri
}

export const CuratedListCard: React.FC<CuratedListCardProps> = ({ list, productCount, previewProducts = [] }) => {
  return (
    <Link 
      to={`/list/${list.id}`}
      className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
    >
      {/* Üst Taraf: Kapak Resmi - Kartın yarısını kaplayacak şekilde büyütüldü */}
      <div className="w-full h-64 relative overflow-hidden flex-shrink-0">
        <div className="absolute top-3 left-3 z-10 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
            <Layers size={12} />
            {productCount} Ürün
        </div>
        <img
          src={list.coverImage || 'https://picsum.photos/600/400'}
          alt={list.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
        
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
           <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2">
             {list.title}
           </h3>
           <p className="text-gray-500 text-sm line-clamp-3">
             {list.description}
           </p>
        </div>

        {/* Alt Kısım: Ürün Önizlemeleri ve Buton */}
        <div className="pt-4 border-t border-gray-50 mt-auto">
          <div className="flex items-center justify-between">
            <div className="flex -space-x-2">
              {previewProducts.slice(0, 4).map((prod) => (
                <div key={prod.id} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-gray-50 relative z-0 hover:z-10 transition-all" title={prod.title}>
                  <img src={prod.imageUrl} alt={prod.title} className="w-full h-full object-cover" />
                </div>
              ))}
              {productCount > 4 && (
                <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 text-xs flex items-center justify-center font-bold border-2 border-white relative z-0">
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