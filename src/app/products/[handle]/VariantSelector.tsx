"use client"
import { ProductOption } from "@/lib/shopify/types";
import { ProductVariant } from "@/lib/shopify/types";
import clsx from "clsx";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

type Option = {
    name: string; // beden
    value: string; // S
}

export default function VariantSelector({
    options,
    variants,
    currency,
    price
}: {
    options: ProductOption[];
    variants: ProductVariant[];
    currency: string;
    price: string;
}) {
    console.log(variants)
    const router = useRouter();
    const searchParams = useSearchParams();
    const [currentPrice, setCurrentPrice] = useState(price);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
    const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
    const handleOptionClick = (option: Option) => {
        const filteredOptions = selectedOptions.filter((o)=> o.name != option.name)
        setSelectedOptions([...filteredOptions, option])
    }
    useEffect(() => {
        const filteredVariants = variants.filter((variant) => {
            return selectedOptions.every((option) => variant.selectedOptions.some((o) => o.name === option.name && o.value === option.value))
        })
        setSelectedVariant(filteredVariants[0])
    }, [selectedOptions])
    useEffect(() => {
        if (selectedVariant) {
            // URL'i güncelle
            const params = new URLSearchParams(searchParams.toString());
            
            // Seçilen tüm seçenekleri URL'e ekle
            selectedOptions.forEach(option => {
                // Seçenek adını küçük harfe çevir ve boşlukları tire ile değiştir
                const paramName = option.name.toLowerCase().replace(/\s+/g, '-');
                // Seçenek değerini küçük harfe çevir
                const paramValue = option.value.toLowerCase();
                params.set(paramName, paramValue);
            });
            
            // Mevcut URL'i güncelle
            const newUrl = `${window.location.pathname}?${params.toString()}`;
            router.replace(newUrl, { scroll: false });
            // price'ı güncelle
            setCurrentPrice(selectedVariant.price.amount)
        }
    }, [selectedVariant, router, searchParams, selectedOptions])
    const handleAddToCart = () => {
        console.log("Sepete Eklendi")
    }
    return (
        <>
            <div className="border-t pt-6">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-semibold">
                  {new Intl.NumberFormat('tr-TR', {
                    style: 'currency',
                    currency: currency
                  }).format(parseFloat(currentPrice))}
                </div>
              </div>
            </div>
            {/* {variants.map((variant) => (
                <button key={variant.id} onClick={() => setSelectedVariant(variant)} className={clsx("border rounded-md p-2", selectedVariant?.id === variant.id && "bg-gray-100")}>
                    {variant.title}
                </button>
            ))} */}
            {
                options.map((option) => (
                    <div key={option.id}>
                        {option.name}
                        {option.values.map((value) => (
                            <button key={value} onClick={() => handleOptionClick({name: option.name, value: value})} className={clsx("border rounded-md p-2", selectedOptions?.find((o)=> o.name == option.name && o.value == value) && "bg-gray-100")}>
                                {value}
                            </button>
                        ))}
                    </div>
                ))
            }
            <button onClick={handleAddToCart} className="bg-black text-white px-4 py-2 rounded-md">Sepete Ekle</button>
        </>
    )
}
