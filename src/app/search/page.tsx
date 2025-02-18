import Search from "@/components/layout/navbar/search"
import { getProducts } from "@/lib/shopify";
import { sorting } from "@/lib/constants";
import Grid from "@/components/grid";
import ProductGridItems from "@/components/layout/product-grid-items";

async function SearchPage({ searchParams }: {
    searchParams?: { [key: string]: string | string[] | undefined };

}) {

    const { sort , q : searchValue} = searchParams as { sort: string, q: string };
    const { sortKey , reverse} = sorting.find((item) => item.slug === sort) || sorting[0];
    const products = await getProducts({ query: searchValue, sortKey, reverse });
    const resultsText = products.length === 1 ? "result" : "results";
    return (
        <div>
            {searchValue ? (
                <p className="mb-4">
                    {products.length === 0 ? "No products found" : `Showing ${products.length} ${resultsText} for`}
                    <span className="font-bold">&quot;{searchValue}&quot;</span>
                </p>
            ) : null}
            {products.length > 0 ? (
                <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    <ProductGridItems products = {products}/>
                </Grid> ) : null}
            
        </div>
    )
}

export default SearchPage;