import { getMenu } from "@/lib/shopify";

export async function Navbar() {

    const menu  = await getMenu("popyork-menu")
    console.log(menu)
    return (
        <nav>
       navvv
        </nav>
    );
}
