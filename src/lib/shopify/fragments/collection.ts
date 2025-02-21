/**
 * Shopify koleksiyonları için GraphQL fragment tanımı.
 * Bu fragment, koleksiyon verilerinin tutarlı bir şekilde sorgulanmasını sağlar.
 */

import seoFragment from "./seo";

/**
 * Collection fragment, bir koleksiyonun temel özelliklerini içerir:
 * @property {string} handle - Koleksiyonun benzersiz tanımlayıcısı/URL-friendly adı
 * @property {string} title - Koleksiyonun başlığı
 * @property {string} description - Koleksiyonun açıklaması
 * @property {Object} seo - Koleksiyonun SEO bilgileri (seo fragmentinden alınır)
 * @property {string} updatedAt - Koleksiyonun son güncellenme tarihi
 */
export const collectionFragment = /* GraphQL */ `
  fragment collection on Collection {
    handle
    title
    description
    seo {
      ...seo
    }
    updatedAt
  }
  ${seoFragment}
`;