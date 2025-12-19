import { unstable_cache } from 'next/cache';

/**
 * Server-side cache helper
 * Next.js'in unstable_cache API'sini kullanarak Prisma query'lerini cache'ler
 */

interface CacheOptions {
  revalidate?: number; // Cache süresi (saniye)
  tags?: string[]; // Tag-based revalidation için
}

/**
 * Cache'lenmiş veri çekme fonksiyonu
 * @param fn - Cache'lenecek async fonksiyon
 * @param key - Cache key (unique olmalı)
 * @param options - Cache seçenekleri
 */
export function cached<T>(
  fn: () => Promise<T>,
  key: string,
  options: CacheOptions = {}
): Promise<T> {
  const {
    revalidate = 300, // Varsayılan 5 dakika
    tags = [],
  } = options;

  return unstable_cache(
    fn,
    [key],
    {
      revalidate,
      tags: tags.length > 0 ? tags : [key],
    }
  )();
}

/**
 * Cache tag'leri
 * Admin panelden veri güncellendiğinde bu tag'ler kullanılarak cache invalidate edilebilir
 */
export const CACHE_TAGS = {
  CATEGORIES: 'categories',
  LISTS: 'lists',
  LINKS: 'links',
  PRODUCTS: 'products',
} as const;




