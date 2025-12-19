import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get profile (public endpoint, no auth required)
    const profile = await prisma.userProfile.findFirst();

    if (!profile) {
      // Return default values if profile doesn't exist
      return NextResponse.json({
        name: "Enes Özen",
        bio: "Teknoloji tutkunu, içerik üreticisi ve en iyi fırsat avcısı.",
        profileImageUrl: "https://yt3.googleusercontent.com/0JmZ86WmvyvkZYLZggr8BBwZanH5TLJFrBQaaujNbHbGxoPWXGQydEk8Yie3MTXCeh9j1qc5KA=s160-c-k-c0x00ffffff-no-rj",
        attentionText: "Gerçek indirim ve fırsatları kaçırmamak için indirim kanallarını takip etmeyi unutma!",
        instagramUrl: "https://instagram.com",
        youtubeUrl: "https://youtube.com",
        tiktokUrl: "https://tiktok.com",
        whatsappUrl: "https://whatsapp.com",
        telegramUrl: "https://t.me",
      });
    }

    return NextResponse.json(profile);
  } catch (error: any) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile', details: error.message },
      { status: 500 }
    );
  }
}




