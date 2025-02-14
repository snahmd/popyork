import { getMenu } from "@/app/lib/shopify";

export async function Navbar() {

    const menu  = await getMenu("popyork-frontend-menu")
    console.log(menu)
    return (
        <nav>
       navvv
        </nav>
    );
}
