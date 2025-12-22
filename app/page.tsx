'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Zap } from 'lucide-react';
import { ProfileHeader } from '@/components/ProfileHeader';

interface Category {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  imageUrl: string | null;
}

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, []);

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

  const handleCategoryClick = (categoryName: string) => {
    router.push(`/products?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="min-h-screen bg-white font-system flex flex-col">
      <div className="flex justify-center py-5 px-5 flex-grow">
        <div className="w-full max-w-4xl">
          <ProfileHeader />

          {loading ? (
            <div className="text-center text-gray-400 py-20">Yükleniyor...</div>
          ) : categories.length > 0 ? (
            <div className="mt-6">
              <div className="grid grid-cols-2 gap-3">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.name)}
                    className="flex items-center justify-between p-3 bg-white border border-[#ddd] rounded hover:shadow-md transition-all group w-full text-left shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      {category.imageUrl ? (
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-white border border-[#ddd] flex items-center justify-center">
                          <Image
                            src={category.imageUrl}
                            alt={category.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors shadow-sm"
                          style={{ backgroundColor: category.color || '#6366f1' }}
                        >
                          {category.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="font-normal text-base text-[#333] group-hover:text-[#1a1a1a]">{category.name}</span>
                    </div>
                    
                    <div className="w-6 h-6 rounded-full bg-white border border-[#ddd] flex items-center justify-center text-[#777] group-hover:bg-gray-100 group-hover:text-[#333] transition-all">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400 py-20">Henüz kategori bulunmuyor.</div>
          )}
        </div>
      </div>
    </div>
  );
}
