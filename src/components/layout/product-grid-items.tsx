import Link from "next/link";
import Grid from "../grid";
import { Product } from "@/lib/shopify/types";
import { GridTileImage } from "../grid/tile";

export default function ProductGridItems({ products }: { products: Product[] }) {
  return (
    <>
    {products.map((product) => (
        <Grid.Item key={product.handle} className="animate-fadeIn">
            <Link href={`/products/${product.handle}`} className="relative inline-block w-full h-full" prefetch={true}>
            </Link>
            <GridTileImage label={
                {
                    title: product.title,
                    amount: product.priceRange.minVariantPrice.amount,
                    currencyCode: product.priceRange.minVariantPrice.currencyCode,
                    position: "center",
                }
            }
                src={product.images[0].url}
                width={product.images[0].width}
                height={product.images[0].height}
                alt={product.title}
            />
        </Grid.Item>
    ))

    }
    </>
  );
}