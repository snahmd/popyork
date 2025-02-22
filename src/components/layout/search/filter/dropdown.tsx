"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { ListItem } from ".";
import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { FilterItem } from "./item";

// Dropdown bileşeni - Filtreleme seçeneklerini içeren açılır menü
export default function FilterItemDropDown({ list }: { list: ListItem[] }) {
  // URL yolu ve arama parametrelerini almak için Next.js hooks'ları
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Aktif seçili öğe ve dropdown'ın açık/kapalı durumunu tutan state'ler
  const [active, setActive] = useState("");
  const [openSelect, setOpenSelect] = useState(false);

  // Dropdown menüsünün DOM referansını tutmak için ref 
  const ref = useRef<HTMLDivElement>(null);

  // Dropdown dışına tıklandığında menüyü kapatmak için etki
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Tıklanan yer dropdown içinde değilse menüyü kapat
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpenSelect(false);
      }
    };

    // Olay dinleyicisini ekle
    window.addEventListener("click", handleClickOutside);

    // Temizleme fonksiyonu - bileşen kaldırıldığında dinleyiciyi kaldır
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  // URL veya arama parametreleri değiştiğinde aktif öğeyi güncelle
  useEffect(() => {
    list.forEach((listItem: ListItem) => {
      // Öğenin path veya slug değerine göre aktif durumu kontrol et
      if (
        ("path" in listItem && pathname === listItem.path) ||
        ("slug" in listItem && searchParams.get("sort") === listItem.slug)
      ) {
        setActive(listItem.title);
      }
    });
  }, [pathname, list, searchParams]);

  return (
    // Dropdown ana konteyneri
    <div className="relative" ref={ref}>
      {/* Dropdown tetikleyici buton */}
      <div
        onClick={() => setOpenSelect(!openSelect)}
        className="flex w-full items-center justify-between rounded border border-black/30 px-4 py-2 text-sm dark:border-white/30"
      >
        {active}
        <ChevronDownIcon className="h-4" />
      </div>
      
      {/* Dropdown içeriği - sadece açıkken gösterilir */}
      {openSelect && (
        <div
          onClick={() => setOpenSelect(false)}
          className="absolute z-40 w-full rounded-b-md bg-white p-4 shadow-md dark:bg-black"
        >
          {/* Liste öğelerini döngüyle göster */}
          {list.map((item: ListItem, i) => (
            <FilterItem item={item} key={i} />
          ))}
        </div>
      )}
    </div>
  );
}