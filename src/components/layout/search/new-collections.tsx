"use client"
import { Collection } from "@/lib/shopify/types";
import clsx from "clsx";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function NewCollections({ collections }: { collections: Collection[] }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const createUrl = (collectionPath: string) => {
        // searchParams'ı güvenli bir şekilde kullanıyoruz
        const params = new URLSearchParams(searchParams?.toString() || '');
        
        // Koleksiyon yolunu doğrudan kullanıyoruz
        return `${collectionPath}?${params.toString()}`;
    };

    return (
        <div>
            <ul>
                {collections.map((collection) => (
                    <li key={collection.title} className="mt-2 flex text-sm text-black dark:text-white">
                        <Link 
                            href={createUrl(collection.path)}
                            className={clsx("w-full hover:underline hover:underline-offset-4", {
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