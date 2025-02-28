import React from 'react'
import {productFragment} from "@/lib/shopify/fragments/product"
import ProductGallery from './ProductGallery'
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import VariantSelector from './VariantSelector';

type Props = {
  params: {
    handle: string
  }
}

const getProduct = async (handle: string) => {
  const response = await fetch(`https://${process.env.SHOPIFY_STORE_DOMAIN}/api/2025-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || ''
    },
    body: JSON.stringify({
        query: `
        query getProduct($handle: String!) {
          product(handle: $handle) {
            ...product
          }
        }
        ${productFragment}
      `,
      variables: {
        handle: handle
      }
    })
  });

  const data = await response.json();
  const sonuc = data?.data?.product;
  console.log("sonuc:")
  console.log(sonuc)
  let variants = sonuc?.variants?.edges;
  variants = variants?.map((variant: any) => variant.node);
  sonuc.variants = variants;
  let images = sonuc?.images?.edges;
  images = images?.map((image: any) => image.node);
  sonuc.images = images;
  return sonuc;

}

const ProductPage = async ({params}: Props) => {
  const product = await getProduct(params.handle)
  
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="w-full">
          <ProductGallery images={product.images} title={product.title} />
        </div>
        <div className="w-full">
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">{product.title}</h1>
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: product.description }}></div>
            
            <div className="border-t pt-6">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-semibold">
                  {new Intl.NumberFormat('tr-TR', {
                    style: 'currency',
                    currency: product.priceRange.maxVariantPrice.currencyCode
                  }).format(parseFloat(product.priceRange.maxVariantPrice.amount))}
                </div>
              </div>
            </div>

            <VariantSelector options={product.options} variants={product.variants} />
          </div>
        </div>
      </div>
    </div>
  )
}
export default ProductPage
