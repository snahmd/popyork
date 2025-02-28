"use client"
import { ProductOption } from "@/lib/shopify/types";
import { ProductVariant } from "@/lib/shopify/types";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";




export default function VariantSelector({
    options,
    variants,
}: {
    options: ProductOption[];
    variants: ProductVariant[];
}) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const state = Object.fromEntries(searchParams.entries());
    console.log("--------------------------------")
    console.log("state:")
    console.log(state)
    console.log("options:")
    console.log(options)
    console.log("variants:")
    console.log(variants)
    console.log("--------------------------------")
    return null
}
