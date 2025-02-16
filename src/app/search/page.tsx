import Search from "@/components/layout/navbar/search"
import { getProducts } from "@/lib/shopify";
import { sorting } from "@/lib/shopify/constants";

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
            
        </div>
    )
}

export default SearchPage;