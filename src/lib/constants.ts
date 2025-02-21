// Uygulama genelinde kullanılan etiketlerin tanımlandığı nesne
// Bu etiketler koleksiyonlar, ürünler ve sepet sayfalarını tanımlar
export const TAGS =  {
    collections: "collections",
    products: "products",
    cart: "cart",
}

// Sıralama ve filtreleme seçenekleri için tip tanımı
// Her bir sıralama seçeneği için başlık, URL slug'ı, sıralama anahtarı ve sıralama yönü bilgilerini içerir
export type SortFilterItem = {
    title: string;          // Sıralama seçeneğinin kullanıcıya gösterilecek başlığı
    slug: string | null;    // URL'de kullanılacak slug değeri
    sortKey: "RELEVANCE" | "BEST_SELLING" | "CREATED_AT" | "PRICE";  // Sıralama kriteri
    reverse: boolean;       // Sıralamanın yönü (true: azalan, false: artan)
};
  
// Varsayılan sıralama seçeneği - İlgi düzeyine göre sıralama
export const defaultSort: SortFilterItem = {
    title: "Relevance",
    slug: null,
    sortKey: "RELEVANCE",
    reverse: false,
};
  
// Tüm sıralama seçeneklerinin tanımlandığı dizi
export const sorting: SortFilterItem[] = [
    defaultSort,
    {
      title: "Trending",           // Trend olan ürünler
      slug: "trending-desc",
      sortKey: "BEST_SELLING",
      reverse: false,
    },
    {
      title: "Latest arrivals",    // En yeni ürünler
      slug: "latest-desc",
      sortKey: "CREATED_AT",
      reverse: true,
    },
    {
      title: "Price: Low to high", // Fiyat: Düşükten yükseğe
      slug: "price-asc",
      sortKey: "PRICE",
      reverse: false,
    },
    {
      title: "Price: High to low", // Fiyat: Yüksekten düşüğe
      slug: "price-desc",
      sortKey: "PRICE",
      reverse: true,
    },
];

// Shopify GraphQL API'sinin endpoint URL'i
export const SHOPIFY_GRAPHQL_API_ENDPOINT = "/api/2025-01/graphql.json";

// Frontend'de gizlenecek ürünleri işaretlemek için kullanılan etiket
export const HIDDEN_PRODUCT_TAG = "nextjs-frontend-hidden";

