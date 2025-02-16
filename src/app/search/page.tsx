import Search from "@/components/layout/navbar/search"
import { getProducts } from "@/lib/shopify";

async function SearchPage({ searchParams }: {
    searchParams?: { [key: string]: string | string[] | undefined };

}) {
    const searchValue = "shirt";
    const products = []
    await getProducts({
        query: searchValue as string,
        reverse: false,
        sortKey: "RELEVANCE",
    });
    const resultsText = 1
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