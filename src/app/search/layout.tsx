// İlgili bileşen ve yardımcı modüller ithal ediliyor.
import Footer from "@/components/layout/footer"; // Footer bileşeni (kullanılabilir, ancak şu anda JSX içerisinde aktif değil)
import Collections from "@/components/layout/search/collections"; // Eskiden kullanılmış arşiv koleksiyon bileşeni
import FilterList from "@/components/layout/search/filter"; // Arama filtre bileşeni
import NewCollections from "@/components/layout/search/new-collections"; // Güncellenmiş koleksiyon bileşeni
import { sorting } from "@/lib/constants"; // Sıralama seçenekleri sabiti
import { getCollections } from "@/lib/shopify"; // Shopify API'den koleksiyon verilerini çeken fonksiyon

// SearchLayout bileşeni, çocuk bileşenleri ve koleksiyon verilerini içerir.
export default async function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Koleksiyon verilerini çekmek için asenkron fonksiyon kullanılıyor.
  const collections = await getCollections();
  
  return (
    <>
      {/* Ana kapsayıcı div: responsive düzen için Tailwind CSS sınıfları kullanılıyor */}
      <div className="mx-auto flex max-w-screen-2xl flex-col gap-8 px-4 pb-4 text-black md:flex-row dark:text-white">
        <div className="order-first w-full flex-none md:max-w-[125px]">
          {/* Eskiden kullanılan Collections bileşeni yorum satırına alınmış */}
          {/* <Collections /> */}
          {/* Yeni koleksiyon bileşeni, çekilen verilerle render ediliyor */}
          <NewCollections collections={collections} />
        </div>
        <div className="order-last min-h-screen w-full md:order-none">
          {/* Alt bileşenler yerleştirilir */}
          {children}
        </div>
        <div className="order-none flex-none md:order-last md:w-[125px]">
          {/* Sıralama seçenekleri ile FilterList bileşeni kullanılıyor */}
          <FilterList list={sorting} title="Sort by" />
        </div>
      </div>
    </>
  );
}