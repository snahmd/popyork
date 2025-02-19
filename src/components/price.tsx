import clsx from "clsx";

// Price bileşeni, para birimlerini formatlamak ve görüntülemek için kullanılır
// Props:
// - amount: Fiyat miktarı (string olarak)
// - className: İsteğe bağlı CSS sınıfı
// - currencyCode: Para birimi kodu (varsayılan: "USD")
// - currencyCodeClassName: Para birimi kodu için isteğe bağlı CSS sınıfı
const Price = ({
  amount,
  className,
  currencyCode = "USD",
  currencyCodeClassName,
}: {
  amount: string;
  className?: string;
  currencyCode: string;
  currencyCodeClassName?: string;
} & React.ComponentProps<"p">) => (
  // suppressHydrationWarning, sunucu ve istemci tarafında oluşturulan içeriğin
  // farklı olması durumunda hydration uyarılarını bastırır
  <p suppressHydrationWarning={true} className={className}>
    {/* Intl.NumberFormat kullanarak fiyatı yerel para birimi formatında göster */}
    {`${new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyCode,
      currencyDisplay: "narrowSymbol",
    }).format(parseFloat(amount))}`}
    {/* Para birimi kodunu ayrı bir span içinde göster */}
    <span
      className={clsx("ml-1 inline", currencyCodeClassName)}
    >{`${currencyCode}`}</span>
  </p>
);

export default Price;