import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cached, CACHE_TAGS } from '@/lib/cache';

// Cache için revalidate süresi (saniye cinsinden)
export const revalidate = 300; // 5 dakika

export async function GET() {
  try {
    // Cache'lenmiş veriyi kullan
    const categories = await cached(
      async () => {
        return await prisma.category.findMany({
          orderBy: {
            name: 'asc',
          },
        });
      },
      'categories',
      {
        revalidate: 300, // 5 dakika
        tags: [CACHE_TAGS.CATEGORIES],
      }
    );
    
    const response = NextResponse.json(categories);
    
    // Cache headers ekle (CDN ve browser cache için)
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=300, stale-while-revalidate=600'
    );
    
    return response;
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories', details: error.message },
      { status: 500 }
    );
  }
}
