/**
 * Label bileşeni, ürün kartları üzerinde fiyat ve başlık bilgilerini gösteren bir etikettir.
 * Bu bileşen, ürün başlığını ve fiyatını yarı saydam bir arka plan üzerinde gösterir.
 * 
 * Props:
 * @param {string} title - Ürünün başlığı
 * @param {number} amount - Ürünün fiyat miktarı
 * @param {string} currencyCode - Para birimi kodu (örn: USD, TRY)
 * @param {"bottom" | "center"} position - Etiketin konumu. Varsayılan değer "bottom"
 */
import clsx from "clsx";
import Price from "../price";

export default function Label({title, amount, currencyCode, position = "bottom"} : 
    {title: string,
    amount: number,
    currencyCode: string,
    position?:  "bottom" | "center"
}) {
    return (
        // Ana kapsayıcı div - etiketin konumunu ve boyutunu kontrol eder
        <div
            className =  {clsx(
                "absolute bottom-0 left-0 flex w-full px-4 pb-4 srccontainer/label",
                {
                    // Etiket "center" konumunda ise ek padding uygulanır
                    "lg:px-20 lg:pb[35%]" : position === "center",
                }
            )}
        >

        {/* Etiketin içerik kısmı - yarı saydam arka plan ve içerik düzeni */}
        <div className="flex items-center rounded-full border bg-white/70 p-1 text-xs font-semibold text-black backdrop-blur-md dark:border-neutral-800 dark:bg-black/70 dark:text-white">
            {/* Ürün başlığı - maksimum 2 satır gösterilir */}
            <h3 className="mr-4 line-clamp-2 flex-grow pl-2 leading-none tracking-tight">
                {title}
            </h3>
            {/* Fiyat bileşeni - özel stil ve para birimi gösterimi */}
            <Price
                className="flex-none rounded-full bg-blue-600 p-2 text-white"
                amount={`${amount}`}
                currencyCode={currencyCode}
                currencyCodeClassName="hidden src[275px]/label:inline"
            />
        </div>
        </div>
    );
}