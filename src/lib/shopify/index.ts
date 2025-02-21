/**
 * Shopify entegrasyonu için ana modül
 * Bu dosya Shopify Storefront API ile iletişim kurmak için gerekli tüm fonksiyonları içerir
 */

import { HIDDEN_PRODUCT_TAG } from "../constants";
import { ensureStartWith } from "../utils";
import { SHOPIFY_GRAPHQL_API_ENDPOINT, TAGS } from "../constants";
import { getMenuQuery } from "./queries/menu";
import { getProductsQuery } from "./queries/products";
import { isShopifyError } from "../type-guards";
import {
    Collection,
    Connection,
    Image,
    Menu,
    Product,
    ShopifyCollection,
    ShopifyCollectionProductsOperation,
    ShopifyCollectionsOperation,
    ShopifyMenuOperation,
    ShopifyProduct,
    ShopifyProductsOperation,
} from "./types";
import {
    getCollectionProductsQuery,
    getCollectionsQuery,
} from "./queries/collection";

/**
 * Shopify mağaza ayarları
 * domain: Mağazanın tam URL'si
 * endpoint: GraphQL API'nin endpoint'i
 * key: API erişim anahtarı
 */
const domain = process.env.SHOPIFY_STORE_DOMAIN
    ? ensureStartWith(process.env.SHOPIFY_STORE_DOMAIN, "https://")
    : "";
const endpoint = `${domain}/${SHOPIFY_GRAPHQL_API_ENDPOINT}`;
const key = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || "";

/**
 * Generic tip yardımcısı
 * GraphQL operasyonlarından variables özelliğini çıkarmak için kullanılır
 */
type ExtractVariables<T> = T extends { variables: object } ? T["variables"] : never;

/**
 * Shopify API'sine GraphQL sorguları göndermek için temel fonksiyon
 * @param cache - Önbellekleme stratejisi
 * @param headers - İsteğe eklenecek HTTP başlıkları
 * @param query - GraphQL sorgusu
 * @param tags - Önbellekleme etiketleri
 * @param variables - Sorgu değişkenleri
 */
export async function shopifyFetch<T>({
    cache = "force-cache",
    headers,
    query,
    tags,
    variables,
}: {
    cache?: RequestCache;
    headers?: HeadersInit;
    query: string;
    tags?: string[];
    variables?: ExtractVariables<T>;
}): Promise<{ status: number; body: T } | never> {
    try {
        // API isteğini gerçekleştir
        const result = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Storefront-Access-Token": key,
                ...headers,
            },
            body: JSON.stringify({
                ...(query && { query }),
                ...(variables && { variables }),
            }),
            cache,
            ...(tags && { next: { tags } }),
        });

        const body = await result.json();

        if (body.errors) {
            throw body.errors[0];
        }

        return {
            status: result.status,
            body,
        };
    } catch (error) {
        if (isShopifyError(error)) {
            throw {
                cause: error.cause?.toString() || "Unknown",
                status: error.status || 500,
                message: error.message,
                query,
            };
        }
        throw {
            error,
            query,
        };
    }
}

/**
 * Menü verilerini getiren fonksiyon
 * @param handle - Menü tanımlayıcısı
 * @returns Menü öğelerinin listesi
 */
export async function getMenu(handle: string): Promise<Menu[]> {
    const response = await shopifyFetch<ShopifyMenuOperation>({
        query: getMenuQuery,
        tags: [TAGS.collections],
        variables: { handle },
    });

    return (
        response.body?.data?.menu?.items?.map((
            item: { title: string; url: string },
        ) => ({
            title: item.title,
            path: item.url.replace(domain, "").replace(
                "/collections",
                "/search",
            ).replace("/pages", ""),
        })) || []
    );
}

/**
 * GraphQL edges ve nodes yapısını düz diziye çeviren yardımcı fonksiyon
 * Shopify API'sinin döndürdüğü karmaşık yapıyı basitleştirir
 */
function removeEdgesAndNodes<T>(array: Connection<T>): T[] {
    return array.edges.map((edge) => edge?.node);
}

/**
 * Ürün görsellerini işleyen ve yeniden yapılandıran fonksiyon
 * Görsellere otomatik alt text ekler
 */
function reshapeImages(images: Connection<Image>, productTitle: string) {
    const flattened = removeEdgesAndNodes(images);

    return flattened.map((image) => {
        const filename = image.url.match(/.*\/(.*)\..*/)?.[1];

        return {
            ...image,
            altText: image.altText || `${productTitle} - ${filename}`,
        };
    });
}

/**
 * Tek bir ürünün verilerini yeniden yapılandıran fonksiyon
 * Gizli ürünleri filtreleyebilir ve veri yapısını düzenler
 */
function reshapeProduct(
    product: ShopifyProduct,
    filterHiddenProducts: boolean = true,
) {
    if (
        !product ||
        (filterHiddenProducts && product.tags.includes(HIDDEN_PRODUCT_TAG))
    ) {
        return undefined;
    }

    const { images, variants, ...rest } = product;

    return {
        ...rest,
        images: reshapeImages(images, product.title),
        variants: removeEdgesAndNodes(variants),
    };
}

/**
 * Ürün listesini işleyen ve yeniden yapılandıran fonksiyon
 * Tüm ürünleri tek tek işler ve geçerli olanları döndürür
 */
function reshapeProducts(products: ShopifyProduct[]) {
    const reshapedProducts = [];

    for (const product of products) {
        if (product) {
            const reshapedProduct = reshapeProduct(product);

            if (reshapedProduct) {
                reshapedProducts.push(reshapedProduct);
            }
        }
    }

    return reshapedProducts;
}

/**
 * Ürünleri getiren ana fonksiyon
 * Arama, sıralama ve filtreleme özelliklerini destekler
 */
export async function getProducts({
    query,
    reverse,
    sortKey,
}: {
    query?: string;
    reverse?: boolean;
    sortKey?: string;
}): Promise<Product[] | any> {
    const res = await shopifyFetch<ShopifyProductsOperation>({
        query: getProductsQuery,
        tags: [TAGS.products],
        variables: {
            query,
            reverse,
            sortKey,
        },
    });

    const products = removeEdgesAndNodes(res.body.data.products);
    const reshapedProducts = reshapeProducts(products);
    return reshapedProducts;
}

/**
 * Koleksiyon verilerini yeniden yapılandıran fonksiyon
 * URL yollarını düzenler ve koleksiyon bilgilerini formatlar
 */
function reshapeCollection(
    collection: ShopifyCollection,
): Collection | undefined {
    if (!collection) return undefined;

    return {
        ...collection,
        path: `/search/${collection.handle}`,
    };
}

/**
 * Koleksiyon listesini işleyen ve yeniden yapılandıran fonksiyon
 */
function reshapeCollections(collections: ShopifyCollection[]) {
    const reshapedCollections = [];
  
    for (const collection of collections) {
      if (collection) {
        const reshapedCollection = reshapeCollection(collection);
  
        if (reshapedCollection) {
          reshapedCollections.push(reshapedCollection);
        }
      }
    }
  
    return reshapedCollections;
}

/**
 * Tüm koleksiyonları getiren fonksiyon
 * "All" koleksiyonunu ekler ve gizli koleksiyonları filtreler
 */
export async function getCollections(): Promise<Collection[]> {
    const res = await shopifyFetch<ShopifyCollectionsOperation>({
        query: getCollectionsQuery,
        tags: [TAGS.collections],
    });

    const shopifyCollections = removeEdgesAndNodes(
        res?.body?.data?.collections,
    );
    const collections = [
        {
            handle: "",
            title: "All",
            description: "All products",
            seo: {
                title: "All",
                description: "All products",
            },
            path: "/search",
            updatedAt: new Date().toISOString(),
        },
        ...reshapeCollections(shopifyCollections).filter(
            (collection) => !collection.handle.startsWith("hidden"),
        ),
    ];

    return collections;
}

/**
 * Belirli bir koleksiyonun ürünlerini getiren fonksiyon
 * Sıralama ve filtreleme özelliklerini destekler
 */
export async function getCollectionProducts({
    collection,
    reverse,
    sortKey,
}: {
    collection: string;
    reverse?: boolean;
    sortKey?: string;
}): Promise<Product[]> {
    const res = await shopifyFetch<ShopifyCollectionProductsOperation>({
        query: getCollectionProductsQuery,
        tags: [TAGS.collections, TAGS.products],
        variables: {
            handle: collection,
            reverse,
            sortKey: sortKey === "CREATED_AT" ? "CREATED" : sortKey,
        },
    });

    if (!res.body.data.collection) {
        console.log(`No collection found for \`${collection}\``);
        return [];
    }

    return reshapeProducts(
        removeEdgesAndNodes(res.body.data.collection.products),
    );
}
