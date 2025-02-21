/**
 * Koleksiyonları listeleyen ve kullanıcının seçim yapmasını sağlayan bileşen.
 * Bu bileşen, mağazadaki koleksiyonları dinamik olarak görüntüler ve her bir koleksiyon
 * için tıklanabilir bağlantılar oluşturur.
 */
"use client"
import { Collection } from "@/lib/shopify/types";
import clsx from "clsx";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function NewCollections({ collections }: { collections: Collection[] }) {
    // Mevcut sayfa yolunu ve URL parametrelerini alıyoruz
    const pathname = usePathname();
    const searchParams = useSearchParams();

    /**
     * Koleksiyon bağlantıları için URL oluşturan yardımcı fonksiyon
     * @param collectionPath - Koleksiyonun hedef yolu
     * @returns Mevcut arama parametreleriyle birleştirilmiş tam URL
     */
    const createUrl = (collectionPath: string) => {
        // Mevcut URL parametrelerini güvenli bir şekilde yeni URLSearchParams nesnesine kopyalıyoruz
        const params = new URLSearchParams(searchParams?.toString() || '');
        
        // Koleksiyon yolunu ve parametreleri birleştirerek tam URL'yi oluşturuyoruz
        return `${collectionPath}?${params.toString()}`;
    };

    return (
        <div>
            {/* Koleksiyonları listelemek için ul elementi */}
            <ul>
                {collections.map((collection) => (
                    // Her bir koleksiyon için liste öğesi oluşturuyoruz
                    <li key={collection.title} className="mt-2 flex text-sm text-black dark:text-white">
                        <Link 
                            href={createUrl(collection.path)}
                            className={clsx("w-full hover:underline hover:underline-offset-4", {
                                // Aktif koleksiyonu vurgulamak için altını çiziyoruz
                                "underline underline-offset-4": pathname === collection.path,
                            })}
                        >
                            {collection.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}