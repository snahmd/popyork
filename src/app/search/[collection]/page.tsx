// Gerekli bileşenleri ve yardımcı fonksiyonları içe aktarıyoruz
import Grid from "@/components/grid";
import ProductGridItems from "@/components/layout/product-grid-items";
import { defaultSort, sorting } from "@/lib/constants";
import { getCollectionProducts } from "@/lib/shopify";

// Kategori sayfasının ana bileşeni
// params: URL'den gelen koleksiyon parametresi
// searchParams: URL'den gelen sıralama parametreleri
export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { collection: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  // URL'den gelen sıralama parametresini alıyoruz
  const { sort } = searchParams as { [key: string]: string };
  
  // Seçilen sıralama seçeneğini buluyoruz, eğer belirtilmemişse varsayılan sıralamayı kullanıyoruz
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;
    
  // Shopify API'sini kullanarak koleksiyon ürünlerini getiriyoruz
  const products = await getCollectionProducts({
    collection: params.collection,
    sortKey,
    reverse,
  });

  return (
    <section>
      {/* Eğer ürün bulunamazsa uyarı mesajı gösteriyoruz */}
      {products.length === 0 ? (
        <p className="py-3 text-lg">{`No products found in this collection`}</p>
      ) : (
        // Ürünleri responsive grid yapısında gösteriyoruz
        // Mobilde 1, tablet'te 2, masaüstünde 3 sütun olacak şekilde
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products} />
        </Grid>
      )}
    </section>
  );
}