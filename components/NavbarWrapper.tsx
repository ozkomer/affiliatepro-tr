'use client'

import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';

export function NavbarWrapper() {
  const pathname = usePathname();
  
  // Ürün detay ve liste detay sayfalarında navbar'ı gösterme (sayfanın sonunda gösterilecek)
  if (pathname?.startsWith('/product/') || pathname?.startsWith('/list/')) {
    return null;
  }
  
  return <Navbar />;
}

