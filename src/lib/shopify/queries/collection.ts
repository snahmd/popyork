/**
 * Bu dosya Shopify koleksiyonları ve ürünleri için GraphQL sorgularını içerir.
 * Shopify'ın GraphQL API'si üzerinden veri çekmek için kullanılır.
 */

// Koleksiyon ve ürün fragment'lerini içe aktarıyoruz
// Bu fragment'ler, sorgu sonuçlarında hangi alanların döneceğini belirler
import { collectionFragment } from "../fragments/collection";
import { productFragment } from "../fragments/product";

/**
 * getCollectionsQuery: Tüm koleksiyonları getiren GraphQL sorgusu
 * 
 * Özellikler:
 * - İlk 100 koleksiyonu getirir (first: 100)
 * - Koleksiyonları başlığa göre sıralar (sortKey: TITLE)
 * - Her koleksiyon için collectionFragment'te tanımlanan alanları döner
 */
export const getCollectionsQuery = /* GraphQL */ `
  query getCollections {
    collections(first: 100, sortKey: TITLE) {
      edges {
        node {
          ...collection
        }
      }
    }
  }
  ${collectionFragment}
`;

/**
 * getCollectionProductsQuery: Belirli bir koleksiyonun ürünlerini getiren GraphQL sorgusu
 * 
 * Parametreler:
 * @param handle - Koleksiyonun benzersiz tanımlayıcısı (URL-friendly string)
 * @param sortKey - Ürünlerin sıralama kriteri (ProductCollectionSortKeys tipinde)
 * @param reverse - Sıralamanın tersine çevrilip çevrilmeyeceği (Boolean)
 * 
 * Özellikler:
 * - Belirtilen koleksiyondaki ilk 100 ürünü getirir
 * - Ürünleri istenilen kritere göre sıralayabilir
 * - Her ürün için productFragment'te tanımlanan alanları döner
 */
export const getCollectionProductsQuery = /* GraphQL */ `
  query getCollectionProducts(
    $handle: String!
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
  ) {
    collection(handle: $handle) {
      products(sortKey: $sortKey, reverse: $reverse, first: 100) {
        edges {
          node {
            ...product
          }
        }
      }
    }
  }
  ${productFragment}
`;