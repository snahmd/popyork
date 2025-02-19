import { HIDDEN_PRODUCT_TAG } from "../constants";
import { ensureStartWith } from "../utils";
import { SHOPIFY_GRAPHQL_API_ENDPOINT, TAGS } from "../constants";
import { getMenuQuery } from "./queries/menu";
import { getProductsQuery } from "./queries/products";
import { isShopifyError } from "../type-guards";
import { Connection, Menu, Product, ShopifyMenuOperation, ShopifyProduct, ShopifyProductsOperation, Image, ShopifyCollectionProductsOperation, ShopifyCollectionsOperation, Collection } from "./types";

const domain =  process.env.SHOPIFY_STORE_DOMAIN ? ensureStartWith(process.env.SHOPIFY_STORE_DOMAIN, "https://") : "";
const endpoint = `${domain}/${SHOPIFY_GRAPHQL_API_ENDPOINT}`;
const key = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || "";

// Generic tip yardımcısı - variables özelliğini çıkarmak için kullanılır
type ExtractVariables<T> = T extends { variables: object } ? T['variables'] : never;

/**
 * Shopify API'sine GraphQL sorguları göndermek için temel fonksiyon
 * @param cache - İstek önbelleğini kontrol eder. Varsayılan değer 'force-cache':
 *   - 'force-cache': Her zaman önbelleği kullan
 *   - 'no-store': Önbellek kullanma, her zaman yeni istek yap
 *   - 'reload': Önbelleği yenile
 * @param headers - İsteğe eklenecek özel HTTP başlıkları
 * @param query - GraphQL sorgusu
 * @param tags - Önbellekleme için kullanılan etiketler
 * @param variables - GraphQL sorgusuna gönderilecek değişkenler
 */
export async function shopifyFetch<T>({
    // force-cache: Varsayılan olarak her zaman önbelleği kullan
    cache = "force-cache",
    // İsteğe eklenecek özel başlıklar (opsiyonel)
    headers,
    // GraphQL sorgusu (zorunlu)
    query, 
    // Önbellekleme etiketleri (opsiyonel)
    tags,
    // Sorgu değişkenleri (opsiyonel)
    variables,
}: {
    cache?: RequestCache;
    headers?: HeadersInit;
    query: string;
    tags?: string[];
    variables?: ExtractVariables<T>;
}): Promise <{ status: number; body: T} | never  > {
    try {
        // API isteğini gerçekleştir
        const result = await fetch(endpoint, {
            // POST metodu kullanıyoruz çünkü GraphQL istekleri için standart
            method: "POST",
            
            // İstek başlıklarını ayarla
            headers: {
                // JSON formatında veri gönderileceğini belirt
                "Content-Type": "application/json",
                // Shopify API kimlik doğrulama anahtarı
                "X-Shopify-Storefront-Access-Token": key, 
                // Varsa özel başlıkları ekle
                ...headers,
            },
            
            // İstek gövdesini oluştur
            body: JSON.stringify({ 
                // Sorgu varsa ekle
                ...(query && { query}),
                // Değişkenler varsa ekle
                ...(variables && { variables })
             }),
            
            // Önbellek stratejisini ayarla
            cache,
            
            // Next.js için önbellekleme etiketlerini ekle
            ...(tags && {next : { tags }}),
        });

        // API yanıtını JSON formatına çevir
        const body = await result.json();
        
        // GraphQL hata kontrolü
        if (body.errors) {
            // İlk hatayı fırlat
            throw body.errors[0]; 
        }

        // Başarılı yanıtı döndür
        return { 
            status: result.status, // HTTP durum kodu
            body // API yanıt verisi
        };
      
    } catch (error) {
        // Hata yönetimi
        if(isShopifyError(error)) {
            // Shopify'a özgü hataları özel formatta fırlat
            throw {
                cause : error.cause?.toString() || "Unknown",
                status: error.status || 500,
                message: error.message,
                query,
            };
        }
        // Diğer hataları genel formatta fırlat
        throw {
            error,
            query,
        }
    }
}

// Menü verilerini getiren fonksiyon
export async function getMenu(handle: string):  Promise<Menu[]> {
    const response = await shopifyFetch<ShopifyMenuOperation> ( { 
        query: getMenuQuery,
        tags: [TAGS.collections],
        variables: { handle } 
    })
    // Menü öğelerini dönüştür ve yolları düzenle
    return (
        response.body?.data?.menu?.items?.map((item: {title: string, url: string}) => ({
          title : item.title,  
          path : item.url.replace(domain, "").replace("/collections", "/search").replace("/pages", ""),
        }) 
    ) || []
    ); 
}

// GraphQL edges ve nodes yapısını düz diziye çeviren yardımcı fonksiyon
function removeEdgesAndNodes<T>(array: Connection<T>): T[] {
    return array.edges.map((edge) => edge?.node);
}

// Ürün görsellerini yeniden şekillendiren fonksiyon
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

// Ürün verilerini yeniden şekillendiren fonksiyon
function reshapeProduct(
    product: ShopifyProduct,
    filterHiddenProducts: boolean = true
) {
    // Gizli ürünleri filtrele
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

// Ürün listesini yeniden şekillendiren fonksiyon
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

// Ürünleri getiren ana fonksiyon
export async function getProducts({
    query,
    reverse,
    sortKey,
  }: {
    query?: string;
    reverse?: boolean;
    sortKey?: string;
}): Promise<Product[] | any> {
    // Ürünleri API'den al
    const res = await shopifyFetch<ShopifyProductsOperation>({
      query: getProductsQuery,
      tags: [TAGS.products],
      variables: {
        query,
        reverse,
        sortKey,
      },
    });
    
    // Ürün verilerini işle ve dönüştür
    const products = removeEdgesAndNodes(res.body.data.products);
    const reshapedProducts = reshapeProducts(products);
    console.log("--------------------------------");
    console.log(reshapedProducts);
    console.log("--------------------------------");
    
    return reshapedProducts;
}



export async function getCollections(): Promise<Collection[]> {
  const res = await shopifyFetch<ShopifyCollectionsOperation>({
    query: getCollectionsQuery,
    tags: [TAGS.collections],
  });

  const shopifyCollections = removeEdgesAndNodes(res?.body?.data?.collections);
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
    // Filter out the hidden products
    ...reshapeCollections(shopifyCollections).filter(
      (collection) => !collection.handle.startsWith("hidden")
    ),
  ];

  return collections;
}

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
    removeEdgesAndNodes(res.body.data.collection.products)
  );
}