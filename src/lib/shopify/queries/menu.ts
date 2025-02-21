/**
 * Shopify menü verilerini çekmek için kullanılan GraphQL sorgusu
 * 
 * @param handle - Menünün benzersiz tanımlayıcısı (örn: "main-menu", "footer-menu")
 * @returns {Object} Aşağıdaki yapıda menü verisi döner:
 *   - items: Menü öğelerinin listesi
 *     - title: Menü öğesinin başlığı/etiketi
 *     - url: Menü öğesinin yönlendirme linki
 */
export const getMenuQuery =  /* GraphQL */ `
query getMenu($handle: String!) {
    menu(handle: $handle) {
        items {
            title
            url
        }
    }
}
`;