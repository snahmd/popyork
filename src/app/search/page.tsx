import Search from "@/components/layout/navbar/search"
import { getProducts } from "@/lib/shopify";
import { sorting } from "@/lib/constants";
import Grid from "@/components/grid";
import ProductGridItems from "@/components/layout/product-grid-items";

// Arama sayfası bileşeni
// searchParams: URL'den gelen arama parametrelerini içeren nesne
async function SearchPage({ searchParams }: {
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    // URL'den sıralama ve arama değerlerini alma
    const { sort , q : searchValue} = searchParams as { sort: string, q: string };
    
    // Seçilen sıralama seçeneğine göre sortKey ve reverse değerlerini belirleme
    // Eğer sort parametresi geçerli değilse, varsayılan sıralama kullanılır
    const { sortKey , reverse} = sorting.find((item) => item.slug === sort) || sorting[0];
    
    // Shopify'dan ürünleri getirme
    // query: Arama terimi
    // sortKey: Sıralama anahtarı (örn: TITLE, PRICE)
    // reverse: Sıralamanın yönü (artan/azalan)
    const products = await getProducts({ query: searchValue, sortKey, reverse });
    
    // Sonuç metni için tekil/çoğul kontrolü
    const resultsText = products.length === 1 ? "result" : "results";

    return (
        <div>
            {/* Arama sonuçlarını gösteren başlık kısmı */}
            {searchValue ? (
                <p className="mb-4">
                    {products.length === 0 ? "No products found" : `Showing ${products.length} ${resultsText} for`}
                    <span className="font-bold">&quot;{searchValue}&quot;</span>
                </p>
            ) : null}

            {/* Ürün grid'i - Sadece ürün varsa gösterilir */}
            {products.length > 0 ? (
                <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Ürünleri grid içinde gösteren bileşen */}
                    <ProductGridItems products = {products}/>
                </Grid>
            ) : null}
        </div>
    )
}

export default SearchPage;