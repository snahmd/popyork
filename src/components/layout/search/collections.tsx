import { getCollections } from "@/lib/shopify";
import FilterList from "./filter";
import { Suspense } from "react";
import clsx from "clsx";

const skeleton = "mb-3 h-4 w-5/6 animate-pulse rounded";
const activeAndTitles = "bg-neutral-800 dark:bg-neutral-300";
const items = "bg-neutral-400 dark:bg-neutral-700";

/**
 * Collections Bileşeni
 * 
 * Bu bileşen, mağazadaki koleksiyonları listeleyen bir filtreleme arayüzü sunar.
 * Veriler yüklenirken bir yükleme animasyonu (skeleton) gösterir.
 * 
 * @returns {JSX.Element} Koleksiyonlar filtre listesi veya yükleme animasyonu
 */
export default async function Collections() {
  const collections = await getCollections();
  return (
    <Suspense
      fallback={
        <div className="col-span-2 hidden h-[400px] w-full flex-none py-4 lg:block">
          <div className={clsx(skeleton, activeAndTitles)} />
          <div className={clsx(skeleton, activeAndTitles)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
        </div>
      }
    >
      <FilterList list={collections} title="Collections" />;
    </Suspense>
  );
}