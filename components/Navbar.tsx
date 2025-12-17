'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Navbar: React.FC = () => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { name: 'Ana Sayfa', path: '/' },
    { name: 'Tüm Ürünler', path: '/products' },
    { name: 'Listeler', path: '/lists' },
  ];

  return (
    <nav className="bg-gray-800 sticky top-0 z-50 shadow-sm border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-16">
          {/* Menu - Centered for all screen sizes */}
          <div className="flex items-center space-x-4 md:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`px-2 py-2 md:px-3 rounded-md text-xs md:text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-indigo-400 bg-indigo-900/30'
                    : 'text-gray-300 hover:text-indigo-400 hover:bg-gray-700'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
