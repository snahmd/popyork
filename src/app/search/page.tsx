import Search from "@/components/layout/navbar/search"

function SearchPage({ searchParams }: {
    searchParams?: { [key: string]: string | string[] | undefined };

}) {
    const searchValue = searchParams?.q;
    const products = [];
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