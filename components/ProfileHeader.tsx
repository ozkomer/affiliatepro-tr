'use client'

import React, { useEffect, useState } from 'react';

interface UserProfile {
  name: string;
  bio: string | null;
  profileImageUrl: string | null;
  attentionText: string | null;
  instagramUrl: string | null;
  youtubeUrl: string | null;
  tiktokUrl: string | null;
  whatsappUrl: string | null;
  telegramUrl: string | null;
}

export const ProfileHeader: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Default values if profile is not loaded yet
  const displayName = profile?.name || 'Enes Özen';
  const displayBio = profile?.bio || 'Teknoloji tutkunu, içerik üreticisi ve en iyi fırsat avcısı.';
  const displayImageUrl = profile?.profileImageUrl || 'https://yt3.googleusercontent.com/0JmZ86WmvyvkZYLZggr8BBwZanH5TLJFrBQaaujNbHbGxoPWXGQydEk8Yie3MTXCeh9j1qc5KA=s160-c-k-c0x00ffffff-no-rj';
  const displayAttentionText = profile?.attentionText || 'Gerçek indirim ve fırsatları kaçırmamak için indirim kanallarını takip etmeyi unutma!';

  return (
    <section className="bg-white font-system py-5 px-5">
      <div className="max-w-4xl mx-auto text-center">
        {/* Profile Image */}
        <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-2 border-[#ddd]">
          <img 
            src={displayImageUrl} 
            alt={displayName} 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Name */}
        <h1 className="text-lg font-normal text-[#1a1a1a] mb-2">{displayName}</h1>
        
        {/* Bio */}
        {displayBio && (
          <p className="text-sm text-[#333] mb-4 leading-6 px-2.5">
            {displayBio}
          </p>
        )}

        {/* Attention Text */}
        {displayAttentionText && (
          <p className="text-xs text-[#777] mb-6 px-2.5">
            {displayAttentionText}
          </p>
        )}
        
        {/* Cards Container - Social Media and Discount Channels */}
        <div className="flex gap-2.5">
          {/* Social Media Links */}
          {(profile?.instagramUrl || profile?.youtubeUrl || profile?.tiktokUrl) && (
            <div className="flex-1 bg-[#fcfcfc] border border-solid border-[#e0e0e0] p-5 px-4">
              <div className="font-bold text-sm text-[#333] mb-4">
                Sosyal Medya
              </div>
              <div className="flex flex-col gap-2.5 mt-3">
                {profile.instagramUrl && (
                  <a 
                    href={profile.instagramUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full bg-white border border-[#ddd] rounded p-2.5 no-underline flex items-center justify-center gap-1.5 text-[13px] font-semibold text-[#E4405F] hover:shadow-md transition-shadow"
                  >
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" 
                      width={18}
                      height={18}
                      alt="Instagram"
                    />
                    Instagram
                  </a>
                )}

                {profile.youtubeUrl && (
                  <a 
                    href={profile.youtubeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full bg-white border border-[#ddd] rounded p-2.5 no-underline flex items-center justify-center gap-1.5 text-[13px] font-semibold text-[#FF0000] hover:shadow-md transition-shadow"
                  >
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg" 
                      width={18}
                      height={18}
                      alt="YouTube"
                    />
                    YouTube
                  </a>
                )}

                {profile.tiktokUrl && (
                  <a 
                    href={profile.tiktokUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full bg-white border border-[#ddd] rounded p-2.5 no-underline flex items-center justify-center gap-1.5 text-[13px] font-semibold text-[#000000] hover:shadow-md transition-shadow"
                  >
                    <svg 
                      width={18} 
                      height={18} 
                      viewBox="0 0 24 24" 
                      fill="currentColor"
                    >
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.89 2.89 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                    TikTok
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Discount Channels */}
          {(profile?.telegramUrl || profile?.whatsappUrl) && (
            <div className="flex-1 bg-[#fcfcfc] border border-solid border-[#e0e0e0] p-5 px-4">
            <div className="font-bold text-sm text-[#333] mb-4">
              İndirim Kanalıma Katıl
            </div>
              <div className="flex flex-col gap-2.5 mt-3">
                {profile.telegramUrl && (
                  <a 
                    href={profile.telegramUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full bg-white border border-[#ddd] rounded p-2.5 no-underline flex items-center justify-center gap-1.5 text-[13px] font-semibold text-[#0088cc] hover:shadow-md transition-shadow"
                  >
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg" 
                      width={18} 
                      height={18} 
                      alt="Telegram"
                    />
                    Telegram
                  </a>
                )}
                {profile.whatsappUrl && (
                  <a 
                    href={profile.whatsappUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full bg-white border border-[#ddd] rounded p-2.5 no-underline flex items-center justify-center gap-1.5 text-[13px] font-semibold text-[#25D366] hover:shadow-md transition-shadow"
                  >
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
                      width={18} 
                      height={18} 
                      alt="WhatsApp"
                    />
                    WhatsApp
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
