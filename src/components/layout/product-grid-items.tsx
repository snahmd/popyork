/**
 * ProductGridItems Bileşeni
 * Bu bileşen, e-ticaret sitesindeki ürün grid görünümünü oluşturur.
 * Shopify'dan gelen ürün verilerini kullanarak, her ürün için tıklanabilir
 * ve görsel içeren kartlar oluşturur.
 */

// Gerekli bileşen ve tip tanımlamalarının içe aktarılması
import Link from "next/link"; // Sayfa yönlendirmeleri için Next.js link bileşeni
import Grid from "../grid"; // Izgara düzeni için özel grid bileşeni
import { Product } from "@/lib/shopify/types"; // Shopify ürün tipi tanımlaması
import { GridTileImage } from "../grid/tile"; // Izgara görseli için özel bileşen

// Ana bileşen tanımı
// @param products - Shopify'dan gelen ürün dizisi
export default function ProductGridItems({ products }: { products: Product[] }) {
  return (
    <>
    {/* Ürün listesini döngüye alıp her ürün için bir grid öğesi oluşturma */}
    {products.map((product) => (
        // Her ürün için bir grid hücresi oluşturulur
        // key: React liste renderlaması için benzersiz tanımlayıcı
        // animate-fadeIn: Sayfa yüklendiğinde yumuşak geçiş animasyonu
        <Grid.Item key={product.handle} className="animate-fadeIn">
            {/* 
              Ürün detay sayfasına yönlendiren link bileşeni
              - href: Ürünün benzersiz handle'ı ile oluşturulan URL
              - prefetch: Performans için sayfa önceden yüklenir
              - className: Link'in görünüm ve davranış özellikleri
            */}
            <Link href={`/products/${product.handle}`} className="relative inline-block w-full h-full" prefetch={true}>
            </Link>
            {/* 
              GridTileImage: Ürün görselini ve bilgilerini gösteren özel bileşen
              label prop'u içinde:
              - title: Ürün başlığı
              - amount: Ürünün minimum varyant fiyatı
              - currencyCode: Para birimi kodu
              - position: Etiketin konumu
            */}
            <GridTileImage label={
                {
                    title: product.title,
                    amount: product.priceRange.minVariantPrice.amount,
                    currencyCode: product.priceRange.minVariantPrice.currencyCode,
                    position: "center", // Etiketin hücre içindeki konumu
                }
            }
                // Ürün görseli özellikleri
                src={product.images[0].url} // İlk görsel URL'i
                width={product.images[0].width} // Görsel genişliği
                height={product.images[0].height} // Görsel yüksekliği
                alt={product.title} // Erişilebilirlik için alternatif metin
            />
        </Grid.Item>
    ))}
    </>
  );
}