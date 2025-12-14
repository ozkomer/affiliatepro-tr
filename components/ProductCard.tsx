'use client'

import React from 'react';
import { ExternalLink, ShoppingCart, Youtube } from 'lucide-react';
import Link from 'next/link';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  compact?: boolean; 
  variant?: 'grid' | 'horizontal'; // Yeni özellik: Kart varyasyonu
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, compact = false, variant = 'grid' }) => {
  
  // YATAY TASARIM (LISTE DETAY SAYFASI İÇİN)
  if (variant === 'horizontal') {
    return (
      <div className="group bg-gray-800 rounded-xl shadow-sm border border-gray-700 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-row h-32 md:h-40">
        {/* Sol Resim */}
        <Link href={`/product/${product.id}`} className="w-32 md:w-48 flex-shrink-0 relative overflow-hidden bg-gray-900 p-2">
          <img
            src={product.imageUrl || 'https://picsum.photos/400/300'}
            alt={product.title}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Orta İçerik */}
        <div className="flex-grow p-3 md:p-4 flex flex-col justify-between min-w-0">
          <div>
            <Link href={`/product/${product.id}`}>
              <h3 className="font-semibold text-gray-100 text-sm md:text-lg line-clamp-2 group-hover:text-indigo-400 transition-colors">
                {product.title}
              </h3>
            </Link>
            <div className="flex items-center gap-2 mt-1">
               <span className="text-xs text-gray-300 bg-gray-700 px-2 py-0.5 rounded-full">{product.category}</span>
               {product.youtubeUrl && <Youtube size={14} className="text-red-400" />}
            </div>
          </div>
          
          <div className="hidden md:block text-xs text-gray-400 line-clamp-1 mt-1">
            {product.description}
          </div>
        </div>

        {/* Sağ Butonlar */}
        <div className="w-32 md:w-48 flex-shrink-0 p-3 md:p-4 flex flex-col justify-center gap-2 border-l border-gray-700 bg-gray-700/50">
          {product.affiliateLinks && product.affiliateLinks.length > 0 ? (
            product.affiliateLinks.slice(0, 2).map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-200 py-2 text-xs md:text-sm font-medium"
              >
                {link.iconUrl ? (
                    <img src={link.iconUrl} alt="" className="w-4 h-4 object-contain rounded-sm" />
                ) : (
                    <ShoppingCart size={14} />
                )}
                <span className="truncate">{link.label}</span>
              </a>
            ))
          ) : (
             <div className="text-xs text-center text-gray-500">Link Yok</div>
          )}
        </div>
      </div>
    );
  }

  // DIKEY GRID TASARIM (VARSAYILAN)
  // aspect-square ve object-contain ile kareye sığdırma yapıldı
  return (
    <div className={`group bg-gray-800 rounded-xl shadow-sm border border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full ${compact ? 'text-sm' : ''}`}>
      <Link href={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-gray-900 p-4 cursor-pointer border-b border-gray-700">
        <img
          src={product.imageUrl || 'https://picsum.photos/400/300'}
          alt={product.title}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {!compact && (
          <div className="absolute top-2 right-2 bg-gray-900/80 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-semibold text-gray-200 shadow-sm border border-gray-700/50">
            {product.category}
          </div>
        )}
      </Link>
      
      <div className={`flex flex-col flex-grow ${compact ? 'p-3' : 'p-5'}`}>
        <Link href={`/product/${product.id}`}>
          <h3 className={`font-semibold text-gray-100 line-clamp-2 group-hover:text-indigo-400 transition-colors ${compact ? 'text-sm mb-2' : 'text-lg mb-2'}`}>
            {product.title}
          </h3>
        </Link>
        
        {/* Açıklama sadece compact mod kapalıysa görünür */}
        {!compact && (
          <p className="text-sm text-gray-400 line-clamp-3 mb-6 flex-grow">
            {product.description}
          </p>
        )}
        
        <div className={`space-y-2 mt-auto border-t border-gray-700 ${compact ? 'pt-2' : 'pt-4'}`}>
          {product.affiliateLinks && product.affiliateLinks.length > 0 ? (
            product.affiliateLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-between w-full bg-indigo-900/30 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded-lg transition-all duration-300 group/btn ${compact ? 'px-3 py-2 text-xs' : 'px-4 py-2.5 text-sm'}`}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  {link.iconUrl ? (
                     <img src={link.iconUrl} alt="" className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} object-contain rounded-sm flex-shrink-0`} />
                  ) : (
                     <ShoppingCart size={compact ? 14 : 18} className="flex-shrink-0" />
                  )}
                  <span className="font-medium truncate">{link.label}</span>
                </div>
                {!compact && <ExternalLink size={16} className="opacity-70 group-hover/btn:opacity-100 flex-shrink-0" />}
              </a>
            ))
          ) : (
            <div className="text-center text-xs text-gray-500 py-2">Link bulunamadı</div>
          )}
        </div>
      </div>
    </div>
  );
};