export interface AffiliateLink {
  id: string;
  label: string;
  url: string;
  iconUrl: string; // Base64 or URL
}

export interface Category {
  id: string;
  name: string;
  iconUrl?: string;
  isFeatured?: boolean; // Anasayfada gösterilsin mi?
  createdAt: number;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  affiliateLinks: AffiliateLink[];
  category: string;
  shortUrl?: string; // Kısa URL (eneso.cc/product/[shortUrl])
  youtubeUrl?: string; // Opsiyonel YouTube video linki
  createdAt: number;
}

export interface CuratedList {
  id: string;
  title: string;
  slug: string;
  description: string;
  productIds: string[];
  category?: string; // Listenin kategorisi
  coverImage?: string;
  youtubeUrl?: string; // Yeni: Liste için video
  features?: string[]; // Deprecated but kept for compatibility
  isFeatured?: boolean; // Anasayfada gösterilsin mi?
  createdAt: number;
}

// Initial dummy categories - İkonlar güncellendi
export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'c1',
    name: 'F/P Akıllı Saat',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3079/3079162.png', // Smartwatch
    isFeatured: true,
    createdAt: Date.now()
  },
  {
    id: 'c2',
    name: 'F/P Kulaklık',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/5753/5753443.png', // TWS Earbuds
    isFeatured: true,
    createdAt: Date.now()
  },
  {
    id: 'c3',
    name: 'F/P Notebook & Laptop',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3050/3050222.png', // Laptop
    isFeatured: true,
    createdAt: Date.now()
  },
  {
    id: 'c4',
    name: 'F/P Kulaküstü Kulaklık',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2779/2779367.png', // Headphones
    isFeatured: true,
    createdAt: Date.now()
  },
  {
    id: 'c5',
    name: 'F/P Bluetooth Hoparlör',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/8428/8428987.png', // Portable Speaker
    isFeatured: true,
    createdAt: Date.now()
  },
  {
    id: 'c6',
    name: 'F/P Monitör',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/5725/5725807.png', // Monitor
    isFeatured: true,
    createdAt: Date.now()
  },
  {
    id: 'c7',
    name: 'F/P Televizyon',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3920/3920808.png', // Smart TV
    isFeatured: true,
    createdAt: Date.now()
  },
  {
    id: 'c8',
    name: 'F/P Projeksiyon',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3616/3616768.png', // Projector
    isFeatured: true,
    createdAt: Date.now()
  },
  {
    id: 'c9',
    name: 'F/P Tv Box',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/9631/9631245.png', // TV Box
    isFeatured: true,
    createdAt: Date.now()
  },
  {
    id: 'c10',
    name: 'Retro Oyun Konsolu',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/808/808439.png', // Gamepad
    isFeatured: true,
    createdAt: Date.now()
  },
  {
    id: 'c11',
    name: 'Diğer',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1043/1043445.png', // More/Other
    isFeatured: false,
    createdAt: Date.now()
  }
];

// --- SPECIFIC REQUESTED PRODUCTS ---
const SPECIFIC_HEADPHONES: Product[] = [
  {
    id: 'spec_jbl_tune_flex_2',
    title: 'JBL Tune Flex 2 Ghost',
    description: 'JBL Pure Bass sesi, aktif gürültü engelleme ve şeffaf tasarım. Hem açık hem kapalı kullanım imkanı sunan yenilikçi tasarım ve uzun pil ömrü.',
    imageUrl: 'https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?auto=format&fit=crop&q=80&w=600', // Temsili JBL benzeri görsel
    category: 'F/P Kulaklık',
    createdAt: Date.now(),
    affiliateLinks: [
      { id: 'l_jbl_1', label: 'Trendyol', url: '#', iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Trendyol_Logo.svg/1200px-Trendyol_Logo.svg.png' },
      { id: 'l_jbl_2', label: 'Hepsiburada', url: '#', iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Hepsiburada_logo_official.svg' }
    ]
  },
  {
    id: 'spec_samsung_buds_3',
    title: 'Samsung Galaxy Buds 3',
    description: 'Yapay zeka destekli gürültü engelleme, 24-bit Hi-Fi ses kalitesi ve ergonomik tasarımıyla Galaxy ekosisteminin en yenisi.',
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=600', // Temsili Buds benzeri görsel
    category: 'F/P Kulaklık',
    createdAt: Date.now(),
    affiliateLinks: [
      { id: 'l_sam_1', label: 'Amazon', url: '#', iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' }
    ]
  },
  {
    id: 'spec_qcy_ht08',
    title: 'QCY HT08 MeloBuds ANC',
    description: 'Uygun fiyata 40dB hibrit aktif gürültü engelleme, rüzgar gürültüsü azaltma ve 6 mikrofonlu görüşme kalitesi.',
    imageUrl: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&q=80&w=600', // Temsili QCY benzeri görsel
    category: 'F/P Kulaklık',
    createdAt: Date.now(),
    affiliateLinks: [
       { id: 'l_qcy_1', label: 'N11', url: '#', iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/N11_logo.svg/2560px-N11_logo.svg.png' }
    ]
  },
  {
    id: 'spec_huawei_freebuds_se2',
    title: 'Huawei FreeBuds SE 2',
    description: '40 saate varan pil ömrü, hafif ve kompakt tasarım. Hızlı şarj özelliği ile 10 dakikada 3 saat kullanım.',
    imageUrl: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=600', // Temsili Huawei benzeri görsel
    category: 'F/P Kulaklık',
    createdAt: Date.now(),
    affiliateLinks: [
      { id: 'l_hua_1', label: 'Trendyol', url: '#', iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Trendyol_Logo.svg/1200px-Trendyol_Logo.svg.png' }
    ]
  }
];

// --- DATA GENERATOR ---

const PRODUCT_ADJECTIVES = ['Ultra', 'Pro', 'Lite', 'Max', 'Evo', 'Plus', 'Air', 'Neo', 'Prime', 'Core'];
const PRODUCT_NOUNS: Record<string, string[]> = {
  'F/P Akıllı Saat': ['Watch GT', 'Band 8', 'Smart Life', 'Fit Watch', 'Active 2'],
  'F/P Kulaklık': ['Buds T5', 'AirPods Clone', 'Dots 3', 'FreeBuds', 'SoundCore'],
  'F/P Notebook & Laptop': ['MateBook', 'IdeaPad', 'Aspire 5', 'Modern 14', 'V15'],
  'F/P Kulaküstü Kulaklık': ['Q30', 'Bass+ Headset', 'Studio Pro', 'Noise Cancel 5', 'Live 660'],
  'F/P Bluetooth Hoparlör': ['Boombox', 'Go 3', 'Flip Essential', 'SoundLink', 'MegaBoom'],
  'F/P Monitör': ['24" IPS', '27" 144Hz', 'Curved 165Hz', 'UltraWide', 'Office 22"'],
  'F/P Televizyon': ['55" 4K Android', '50" QLED', '43" Smart TV', '65" UHD', 'Google TV'],
  'F/P Projeksiyon': ['Mini Beam', 'Portable Cinema', 'FHD Projector', 'Home Theater', 'Wanbo X1'],
  'F/P Tv Box': ['Mi Box S', 'Stick 4K', 'Android Box', 'Google TV Kit', 'H96 Max'],
  'Retro Oyun Konsolu': ['Game Stick 4K', 'Handheld 400in1', 'Retro Station', 'Mini Arcade', 'Sup Game'],
  'Diğer': ['Akıllı Priz', 'RGB Şerit', 'Masa Lambası', 'Type-C Hub', 'Sırt Çantası']
};

const generateDummyProducts = (count: number): Product[] => {
  const products: Product[] = [];
  const categories = INITIAL_CATEGORIES.map(c => c.name);

  for (let i = 1; i <= count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const nounList = PRODUCT_NOUNS[category] || ['Cihaz', 'Ürün'];
    const noun = nounList[Math.floor(Math.random() * nounList.length)];
    const adjective = PRODUCT_ADJECTIVES[Math.floor(Math.random() * PRODUCT_ADJECTIVES.length)];
    const id = `p${i}`;

    // Random YouTube logic (about 20% of products)
    const hasYoutube = Math.random() > 0.8;
    const youtubeUrl = hasYoutube ? 'https://www.youtube.com/watch?v=LXb3EKWsInQ' : undefined;

    products.push({
      id,
      title: `${noun} ${adjective} ${2024}`,
      description: `Bu ${category} kategorisindeki ${noun}, sunduğu özelliklere göre harika bir fiyat avantajına sahip. ${adjective} serisinin en çok tercih edilen modeli.`,
      imageUrl: `https://picsum.photos/seed/${id}prod/600/600`,
      category,
      youtubeUrl,
      createdAt: Date.now() - Math.floor(Math.random() * 1000000000),
      affiliateLinks: [
        { 
          id: `l${i}_1`, 
          label: 'Trendyol', 
          url: '#', 
          iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Trendyol_Logo.svg/1200px-Trendyol_Logo.svg.png' 
        },
        { 
          id: `l${i}_2`, 
          label: 'Hepsiburada', 
          url: '#', 
          iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Hepsiburada_logo_official.svg' 
        }
      ]
    });
  }
  return products;
};

// Custom List for specific products
const SPECIFIC_LIST: CuratedList = {
  id: 'list_under_2000',
  title: '2000TL Altı En İyi Kulaklıklar',
  slug: '2000tl-alti-kulakliklar',
  description: 'Bütçe dostu, yüksek ses kalitesi sunan ve fiyat/performans canavarı 4 kulaklık modeli.',
  productIds: SPECIFIC_HEADPHONES.map(p => p.id),
  category: 'F/P Kulaklık',
  coverImage: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=1200',
  isFeatured: true,
  createdAt: Date.now()
};

const generateDummyLists = (count: number, allProducts: Product[]): CuratedList[] => {
  const lists: CuratedList[] = [];
  const categories = INITIAL_CATEGORIES.map(c => c.name);

  for (let i = 1; i <= count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    // Pick 5-12 random products from this category (or random if not enough)
    const categoryProducts = allProducts.filter(p => p.category === category);
    const pool = categoryProducts.length > 5 ? categoryProducts : allProducts;
    
    // Shuffle and slice
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const selectedProductIds = shuffled.slice(0, Math.floor(Math.random() * 7) + 5).map(p => p.id);
    const id = `list${i}`;

    lists.push({
      id,
      title: `${category} Kategorisinde En İyiler`,
      slug: `en-iyi-${category.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '')}-${i}`,
      description: `Sizin için özenle seçtiğimiz ${category} ürünlerini bu listede derledik. İndirimli fiyatları kaçırmayın.`,
      productIds: selectedProductIds,
      category,
      coverImage: `https://picsum.photos/seed/${id}list/800/400`,
      youtubeUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ', // Dummy video
      features: [], 
      isFeatured: Math.random() > 0.7, // 30% chance to be featured
      createdAt: Date.now() - Math.floor(Math.random() * 1000000000)
    });
  }
  return lists;
};

// Generate Data
// Ürün sayısını 40, Liste sayısını 4 olarak ayarladım.
const generatedProducts = generateDummyProducts(40);
const generatedLists = generateDummyLists(4, generatedProducts);

// Merge specific items with generated ones
export const INITIAL_PRODUCTS: Product[] = [...SPECIFIC_HEADPHONES, ...generatedProducts];
export const INITIAL_LISTS: CuratedList[] = [SPECIFIC_LIST, ...generatedLists];