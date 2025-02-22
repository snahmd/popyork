// Bu dosya, grid düzeninde kullanılan bir öğenin (tile) içeriğini render eden GridTileImage bileşenini içerir.
// Resimler için "next/image" bileşeni kullanılarak performans ve optimizasyon hedeflenmiştir.
import Image from "next/image";
import clsx from "clsx";
import Label from "../layout/label";


// GridTileImage fonksiyonu, grid içerisindeki bir öğenin resmini ve opsiyonel olarak etkileşimli label'ı render eder.
// Parametreler: 
// - isInteractive: Resme hover durumunda etkileşim efekti ekler.
// - active: Öğenin aktif olup olmadığına göre border stilini belirler.
// - label: Resmin üzerine eklenen, başlık ve miktar bilgilerini içeren açıklama nesnesidir.
// - ...props: Image bileşenine aktarılan diğer tüm özellikleri barındırır.
export function GridTileImage({ isInteractive = true, active, label, ...props } : {
    isInteractive?: boolean; 
    active?: boolean; 
    label?: {
        title: string; 
        amount: string; 
        currencyCode: string; 
        position?: "bottom" | "center";
    }; 
} & React.ComponentProps<typeof Image>) {
    return (
        <div
          // Ana kapsayıcı div: 
          // - Grid öğesinin tam alanı kaplamasını sağlar.
          // - Border ve arka plan renkleri kullanıcı etkileşimi (hover, aktif) durumuna göre ayarlanır.
          className={clsx(
            "group flex h-full w-full items-center justify-center overflow-hidden border bg-[rgb(235,235,235)] hover:border-blue-600 dark:bg-black",
            {
              relative: label, // Eğer label varsa, div'in konumlandırmasını (relative) etkinleştir.
              "border-2 border-blue-600": active, // Aktif durumda ise daha belirgin mavi border.
              "border-neutral-200 dark:border-neutral-800": !active, // Pasif durumda nötr border kullanılır.
            }
          )}
        >
          {props.src ? (
            <Image
              // Resim bileşeni:
              // - props.src mevcutsa resmi render eder.
              // - isInteractive true ise hover durumunda scale efekti eklenir.
              className={clsx("relative h-full w-full object-cover", {
                "transition duration-300 ease-in-out group-hover:scale-105": isInteractive,
              })}
              {...props}
            />
          ) : null}
          {label ? (
            <Label
              // Label bileşeni:
              // - label parametresi mevcutsa çalışır.
              // - Resmin üzerine metin olarak başlık, miktar ve para birimi bilgilerini ekler.
              title={label.title}
              amount={label.amount}
              currencyCode={label.currencyCode}
              position={label.position}
            />
          ) : null}
        </div>
    );
}