'use client'

import React from 'react';
import { Zap, Instagram, Youtube, Send } from 'lucide-react';

// Özel TikTok İkonu
const TikTokIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

// Özel WhatsApp İkonu
const WhatsAppIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
    <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
  </svg>
);

export const ProfileHeader: React.FC = () => {
  return (
    <section className="bg-gray-800 border-b border-gray-700 pb-8 pt-6 px-4 mb-6">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
        <div className="w-20 h-20 md:w-24 md:h-24 bg-indigo-900/50 rounded-full p-1 mb-3 shadow-md ring-2 ring-indigo-800/50">
           {/* Placeholder for Profile Image */}
           <img 
             src="https://yt3.googleusercontent.com/0JmZ86WmvyvkZYLZggr8BBwZanH5TLJFrBQaaujNbHbGxoPWXGQydEk8Yie3MTXCeh9j1qc5KA=s160-c-k-c0x00ffffff-no-rj" 
             alt="Enes Özen" 
             className="w-full h-full object-cover rounded-full"
           />
        </div>
        
        <h1 className="text-xl md:text-2xl font-bold text-gray-100 mb-1">Enes Özen</h1>
        <p className="text-gray-400 mb-4 max-w-md text-sm">
          Teknoloji tutkunu, içerik üreticisi ve en iyi fırsat avcısı.
        </p>

        {/* Attention Text - Orange & Blinking */}
        <p className="text-xs md:text-sm font-bold text-orange-400 animate-pulse mb-5 max-w-lg px-2">
          Gerçek indirim ve fırsatları kaçırmamak için indirim kanallarını takip etmeyi unutma!
        </p>
        
        {/* Links Container - Mobilde yan yana (flex-row), boşluklar ve boyutlar küçültüldü */}
        <div className="flex flex-row gap-2 sm:gap-3 w-full max-w-xl justify-center">
          
          {/* Sosyal Medya Grubu */}
          <div className="flex-1 bg-gray-700/50 rounded-xl p-2 sm:p-3 border border-gray-600 shadow-sm flex flex-col items-center justify-center">
            <h3 className="text-[10px] sm:text-xs font-bold text-gray-300 mb-1.5 sm:mb-2 uppercase tracking-wide">Sosyal Medya</h3>
            <div className="flex justify-center gap-2 sm:gap-3">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer" 
                className="group"
              >
                <div className="p-1.5 sm:p-2 bg-gray-800 rounded-full text-pink-500 shadow-sm border border-gray-600 group-hover:scale-110 group-hover:bg-pink-900/30 transition-all">
                  <Instagram size={20} />
                </div>
              </a>

              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noreferrer" 
                className="group"
              >
                <div className="p-1.5 sm:p-2 bg-gray-800 rounded-full text-red-500 shadow-sm border border-gray-600 group-hover:scale-110 group-hover:bg-red-900/30 transition-all">
                  <Youtube size={20} />
                </div>
              </a>

              <a 
                href="https://tiktok.com" 
                target="_blank" 
                rel="noreferrer" 
                className="group"
              >
                <div className="p-1.5 sm:p-2 bg-gray-800 rounded-full text-gray-200 shadow-sm border border-gray-600 group-hover:scale-110 group-hover:bg-gray-700 transition-all">
                  <TikTokIcon size={20} />
                </div>
              </a>
            </div>
          </div>

          {/* İndirim Kanalları Grubu */}
          <div className="flex-1 bg-indigo-900/30 rounded-xl p-2 sm:p-3 border border-indigo-700/50 shadow-sm flex flex-col items-center justify-center">
            <h3 className="text-[10px] sm:text-xs font-bold text-indigo-300 mb-1.5 sm:mb-2 uppercase tracking-wide flex items-center justify-center gap-1">
               <Zap size={10} className="fill-indigo-400 text-indigo-400 sm:w-3 sm:h-3" /> İndirim Kanalları
            </h3>
            <div className="flex justify-center gap-2 sm:gap-3">
              <a 
                href="https://whatsapp.com" 
                target="_blank" 
                rel="noreferrer" 
                className="group"
              >
                <div className="p-1.5 sm:p-2 bg-gray-800 rounded-full text-green-400 shadow-sm border border-gray-600 group-hover:scale-110 group-hover:bg-green-900/30 transition-all">
                  <WhatsAppIcon size={20} />
                </div>
              </a>

              <a 
                href="https://t.me" 
                target="_blank" 
                rel="noreferrer" 
                className="group"
              >
                <div className="p-1.5 sm:p-2 bg-gray-800 rounded-full text-sky-400 shadow-sm border border-gray-600 group-hover:scale-110 group-hover:bg-sky-900/30 transition-all">
                  <Send size={20} />
                </div>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};