import React from 'react'
import {productFragment} from "@/lib/shopify/fragments/product"
import ProductGallery from './ProductGallery'
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

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
    <div className="container mx-auto px-4">
      <ProductGallery images={product.images} title={product.title} />
    </div>
  )
}
export default ProductPage
