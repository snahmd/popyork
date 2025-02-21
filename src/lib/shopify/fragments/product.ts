import imageFragment from "./image";
import seoFragment from "./seo";

// Product fragment, Shopify'dan ürün verilerini çekmek için kullanılan GraphQL sorgu parçası
export const productFragment = /* GraphQL */ `
    fragment product on Product {
    # Ürünün benzersiz tanımlayıcısı
    id
    # Ürünün URL-dostu benzersiz ismi
    handle
    # Ürünün satışta olup olmadığını belirten boolean değer
    availableForSale
    # Ürün başlığı
    title
    # Ürün açıklaması (düz metin)
    description
    # Ürün açıklaması (HTML formatında)
    descriptionHtml
    # Ürün seçenekleri (renk, beden vb.)
    options {
      id
      name
      values
    }
    # Ürün fiyat aralığı bilgisi
    priceRange {
      # En yüksek varyant fiyatı
      maxVariantPrice {
        amount
        currencyCode
      }
      # En düşük varyant fiyatı
      minVariantPrice {
        amount
        currencyCode
      }
    }
    # Ürün varyantları (ilk 250 varyant)
    variants(first: 250) {
      edges {
        node {
          id
          title
          availableForSale
          # Seçili varyant özellikleri
          selectedOptions {
            name
            value
          }
          # Varyant fiyat bilgisi
          price {
            amount
            currencyCode
          }
        }
      }
    }
    # Ürünün öne çıkan görseli
    featuredImage {
      ...image
    }
    # Ürüne ait tüm görseller (ilk 20 görsel)
    images(first: 20) {
      edges {
        node {
          ...image
        }
      }
    }
    # Ürün SEO bilgileri
    seo {
      ...seo
    }
    # Ürün etiketleri
    tags
    # Ürünün son güncellenme tarihi
    updatedAt
    }
    # Image ve SEO fragment'lerinin eklenmesi
    ${imageFragment}
    ${seoFragment}
`;
