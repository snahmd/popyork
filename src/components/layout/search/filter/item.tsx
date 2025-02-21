"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { ListItem, type PathFilterItem } from ".";
import Link from "next/link";
import { createUrl } from "@/lib/utils";
import type { SortFilterItem } from "@/lib/constants";
import clsx from "clsx";

// Path tabanlı filtreleme öğelerini render eden bileşen
function PathFilterItem({ item }: { item: PathFilterItem }) {
  // Mevcut URL yolunu ve arama parametrelerini alıyoruz
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // Öğenin aktif olup olmadığını kontrol ediyoruz
  const active = pathname === item.path;
  const newParams = new URLSearchParams(searchParams.toString());
  // Aktif durum için p elementi, değilse Link komponenti kullanıyoruz
  const DynamicTag = active ? "p" : Link;

  // Arama parametresini temizliyoruz
  newParams.delete("q");

  return (
    <li className="mt-2 flex text-black dark:text-white" key={item.title}>
      <DynamicTag
        href={createUrl(item.path, newParams)}
        className={clsx(
          "w-full text-sm underline-offset-4 hover:underline dark:hover:text-neutral-100",
          {
            "underline underline-offset-4": active,
          }
        )}
      >
        {item.title}
      </DynamicTag>
    </li>
  );
}

// Sıralama filtreleme öğelerini render eden bileşen
function SortFilterItem({ item }: { item: SortFilterItem }) {
  // Mevcut URL yolunu ve arama parametrelerini alıyoruz
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // Öğenin aktif olup olmadığını kontrol ediyoruz
  const active = searchParams.get("sort") === item.slug;
  const q = searchParams.get("q");

  // Yeni URL'yi oluşturuyoruz
  const href = createUrl(
    pathname,
    new URLSearchParams({
      // Eğer arama parametresi varsa ekliyoruz
      ...(q && { q }),
      // Eğer sıralama parametresi varsa ve boş değilse ekliyoruz
      ...(item.slug && item.slug.length && { sort: item.slug }),
    })
  );
  // Aktif durum için p elementi, değilse Link komponenti kullanıyoruz
  const DynamicTag = active ? "p" : Link;

  return (
    <li
      className="mt-2 flex text-sm text-black dark:text-white"
      key={item.title}
    >
      <DynamicTag
        prefetch={!active ? false : undefined}
        href={href}
        className={clsx("w-full hover:underline hover:underline-offset-4", {
          "underline underline-offset-4": active,
        })}
      >
        {item.title}
      </DynamicTag>
    </li>
  );
}

// Ana FilterItem bileşeni - gelen öğenin tipine göre uygun bileşeni render eder
export function FilterItem({ item }: { item: ListItem }) {
  // Eğer öğede 'path' özelliği varsa PathFilterItem, yoksa SortFilterItem kullanıyoruz
  return "path" in item ? (
    <PathFilterItem item={item} />
  ) : (
    <SortFilterItem item={item} />
  );
}