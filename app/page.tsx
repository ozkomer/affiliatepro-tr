'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ProfileHeader } from '@/components/ProfileHeader';

interface Category {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  imageUrl: string | null;
}

const CACHE_KEY = 'categories_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 dakika

interface CacheData {
  data: Category[];
  timestamp: number;
}

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const getCachedData = (): Category[] | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;
      
      const cacheData: CacheData = JSON.parse(cached);
      const now = Date.now();
      
      // Cache süresi dolmuş mu kontrol et
      if (now - cacheData.timestamp > CACHE_DURATION) {
        localStorage.removeItem(CACHE_KEY);
        return null;
      }
      
      return cacheData.data;
    } catch (error) {
      console.error('Error reading cache:', error);
      return null;
    }
  };

  const setCachedData = (data: Category[]) => {
    if (typeof window === 'undefined') return;
    
    try {
      const cacheData: CacheData = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error setting cache:', error);
    }
  };

  const fetchCategories = async () => {
    // Önce cache'den kontrol et
    const cachedData = getCachedData();
    if (cachedData) {
      const filteredCategories = cachedData.filter((category: Category) => 
        category.name.toLowerCase() !== 'özel listeler'
      );
      setCategories(filteredCategories);
      setLoading(false);
      
      // Arka planda fresh data çek (stale-while-revalidate pattern)
      fetchCategoriesFromAPI();
      return;
    }
    
    // Cache yoksa direkt API'den çek
    await fetchCategoriesFromAPI();
  };

  const fetchCategoriesFromAPI = async () => {
    try {
      const response = await fetch('/api/categories', {
        // Cache-Control header'ı API route'unda ayarlandı
        cache: 'default',
      });
      
      if (response.ok) {
        const data = await response.json();
        // "Özel Listeler" kategorisini filtrele
        const filteredCategories = data.filter((category: Category) => 
          category.name.toLowerCase() !== 'özel listeler'
        );
        
        setCategories(filteredCategories);
        setCachedData(data); // Cache'e kaydet
      } else {
        console.error('Failed to fetch categories:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      <ProfileHeader />

      {loading ? (
        <section className="max-w-5xl mx-auto px-4 w-full">
          <div className="text-center text-gray-400 py-12">Yükleniyor...</div>
        </section>
      ) : categories.length > 0 ? (
        <section className="max-w-5xl mx-auto px-4 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(category => (
              <Link
                key={category.id}
                href={`/category/${category.id}`}
                className="flex items-center gap-3 p-4 bg-gray-800/50 border border-gray-700/50 rounded-lg hover:bg-gray-800 hover:border-gray-600 transition-colors w-full text-left"
              >
                {category.imageUrl ? (
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-700/50 flex items-center justify-center flex-shrink-0">
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-lg font-semibold flex-shrink-0"
                    style={{ backgroundColor: category.color || '#4b5563' }}
                  >
                    {category.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="font-medium text-sm text-gray-200">{category.name}</span>
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <section className="max-w-5xl mx-auto px-4 w-full">
          <div className="text-center text-gray-400 py-12">Henüz kategori bulunmuyor.</div>
        </section>
      )}
    </div>
  );
}
