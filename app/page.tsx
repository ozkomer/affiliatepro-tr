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
    <div className="flex flex-col gap-6 pb-12">
      <ProfileHeader />

      {loading ? (
        <section className="max-w-4xl mx-auto px-4 w-full">
          <div className="text-center text-gray-400 py-8">Yükleniyor...</div>
        </section>
      ) : categories.length > 0 ? (
        <section className="max-w-4xl mx-auto px-4 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.name)}
                className="flex items-center justify-between p-3 bg-gray-800 border border-gray-700 rounded-xl hover:shadow-md hover:border-indigo-500 transition-all group w-full text-left"
              >
                <div className="flex items-center gap-3">
                  {category.imageUrl ? (
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 border border-gray-600 flex items-center justify-center">
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
                  <span className="font-bold text-base text-gray-200 group-hover:text-indigo-400">{category.name}</span>
                </div>
                
                <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </section>
      ) : (
        <section className="max-w-4xl mx-auto px-4 w-full">
          <div className="text-center text-gray-400 py-8">Henüz kategori bulunmuyor.</div>
        </section>
      )}
    </div>
  );
}
