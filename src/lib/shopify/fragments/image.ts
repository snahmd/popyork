/**
 * Bu fragment Shopify'daki Image tipini temsil eder.
 * Shopify GraphQL API'sinden görsel verilerini çekmek için kullanılır.
 * 
 * Fragment içeriği:
 * - url: Görselin tam URL adresi
 * - altText: Görselin alternatif metni (accessibility için önemli)
 * - width: Görselin piksel cinsinden genişliği
 * - height: Görselin piksel cinsinden yüksekliği
 * 
 * Bu fragment diğer GraphQL sorgularında görsel verilerini almak için yeniden kullanılabilir.
 */
const imageFragment = /* GraphQL */ `
  fragment image on Image {
    url
    altText
    width
    height
  }
`;

export default imageFragment;
