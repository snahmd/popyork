import { getMenu } from "@/lib/shopify";
import { Menu } from "@/lib/shopify/types";
import { truncate } from "fs/promises";
import Link from "next/link";
import MobileMenu from "./mobile-menu";
import Search from "./search";
import LogoIcon from "@/components/icons/logo";
import LogoSquare from "@/components/logo-square";
export async function Navbar() {

    const menu  = await getMenu("popyork-menu")
    console.log("+++++++")
    console.log(menu)
    return (
        <nav className="flex items-center justify-between p-4 lg:px-8">
            <div className="block flex-none md:hidden">
                <MobileMenu menu={menu} />
            </div>
            <div className="flex w-full items-center justify-center gap-8">
                <div className="flex w-full md:w-1/3 gap-8">
                <Link href={"/"} prefetch={true} className="mr-2 flex w-full items-center justify-center md:w-auto ld:mr-6">
                <LogoSquare />
                <div className="ml-2 flex-none text-sm font-medium uppercase md:hidden lg:block">
                    {process.env.SITE_NAME}
                </div>
                </Link>
                {menu.length > 0 ? (
                    <ul className="hidden gap-6 text-sm md:flex md:items-center" >
                        
                            {menu.map((item:Menu,) => (
                                <li key={item.title}>
                                    <Link href={item.path} prefetch={true} className="text-gray-700 underline-offset-4 hover:text-black hover:underline dark:text-neutral-400 dark:hover:text-neutral-300" >
                                        {item.title}
                                    </Link>
                                </li>
                           ) )}
                        
                    </ul>
                ) : null}
                </div>
                <div className="hidden  justify-center md:flex md:w-1/3">
                    <Search />

                </div>
                <div className="flex  justify-end md:flex md:w-1/3">
                    ..

                </div>
            </div>
       
        </nav>
    );
}
