'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X, Settings } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
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
        <div className="flex justify-between h-16">
          <div className="flex items-center">
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-indigo-400 bg-indigo-900/30'
                    : 'text-gray-300 hover:text-indigo-400 hover:bg-gray-700'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/admin"
              className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors border ${
                isActive('/admin')
                  ? 'border-indigo-500 bg-indigo-900/30 text-indigo-300'
                  : 'border-gray-600 text-gray-400 hover:border-indigo-500 hover:text-indigo-400'
              }`}
            >
              <Settings size={16} />
              <span>Panel</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-300 hover:bg-gray-700 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.path)
                    ? 'text-indigo-400 bg-indigo-900/30'
                    : 'text-gray-300 hover:text-indigo-400 hover:bg-gray-700'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-indigo-400 hover:bg-gray-700"
            >
              Yönetim Paneli
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
