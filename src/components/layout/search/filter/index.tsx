// Gerekli bileşenlerin ve tiplerin importları
import { SortFilterItem } from "@/lib/constants";
import { FilterItem } from "./item";
import FilterItemDropDown from "./dropdown";

// Tip tanımlamaları
// PathFilterItem: Başlık ve yol bilgisini içeren filtre öğesi tipi
export type PathFilterItem = { title: string; path: string };
// ListItem: SortFilterItem veya PathFilterItem tiplerinden birini içerebilen birleşik tip
export type ListItem = SortFilterItem | PathFilterItem;

// FilterItemList Bileşeni
// Verilen liste öğelerini FilterItem bileşenleri olarak render eder
function FilterItemList({ list }: { list: ListItem[] }) {
  return (
    <>
      {list.map((item: ListItem, i) => (
        <FilterItem key={i} item={item} />
      ))}
    </>
  );
}

// Ana FilterList Bileşeni
// Props:
// - list: Gösterilecek filtre öğelerinin listesi
// - title: Opsiyonel başlık metni
export default function FilterList({
  list,
  title,
}: {
  list: ListItem[];
  title?: string;
}) {
  return (
    <>
      <nav>
        {/* Başlık varsa, sadece masaüstü görünümünde göster */}
        {title ? (
          <h3 className="hidden text-xs text-neutral-500 md:block dark:text-neutral-400">
            {title}
          </h3>
        ) : null}
        
        {/* Masaüstü görünümü için normal liste */}
        <ul className="hidden md:block">
          <FilterItemList list={list} />
        </ul>
        
        {/* Mobil görünüm için açılır menü */}
        <ul className="md:hidden">
          <FilterItemDropDown list={list} />
        </ul>
      </nav>
    </>
  );
}