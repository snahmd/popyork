import { productFragment } from "../fragments/product";

/**
 * Shopify mağazasından ürünleri çekmek için kullanılan GraphQL sorgusu
 * 
 * @param sortKey - Ürünlerin sıralanacağı alan (örn: TITLE, PRICE, CREATED_AT)
 * @param reverse - Sıralamanın tersine çevrilip çevrilmeyeceği
 * @param query - Ürünleri filtrelemek için kullanılacak arama sorgusu
 * 
 * Sorgu özellikleri:
 * - İlk 100 ürünü getirir
 * - Ürünler belirtilen kriterlere göre sıralanabilir
 * - Arama filtresi uygulanabilir
 * - Her ürün için product fragment'ında belirtilen alanları döndürür
 */
export const getProductsQuery = /* GraphQL */ `
  query getProducts(
    $sortKey: ProductSortKeys
    $reverse: Boolean
    $query: String
  ) {
    products(sortKey: $sortKey, reverse: $reverse, query: $query, first: 100) {
      edges {
        node {
          ...product
        }
      }
    }
  }
  ${productFragment}
`;