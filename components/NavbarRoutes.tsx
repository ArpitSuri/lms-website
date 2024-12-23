"use client"

import { UserButton, useAuth } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { link } from "fs";
import Link from "next/link";
import SearchInput from "./searchInput";
import { isTeacher } from "@/lib/teacher";


const NavbarRoutes = () => {
    const {userId} = useAuth();
    const pathname=usePathname();
    const router =useRouter();

    const isTeacherPage=pathname?.startsWith("/teacher");
    const isCoursePage = pathname?.includes("/courses");
    const isSearchPge = pathname === "/search"

    return ( 
        <>
        <div className="hidden md:block">
            <SearchInput />
        </div>
    <div className="flex gap-x-2 ml-auto">
        {isTeacherPage || isCoursePage ?(
            <Link href="/">
                <Button size='sm' variant='ghost'>
                <LogOut className="h- w-4 mr-2"/>
                Exit
            </Button>
            </Link> ) : isTeacher(userId)? (
             <Link href={"/teacher/courses"}>
                <Button size='sm' variant='ghost'>
                    Teacher Mode
                </Button>

             </Link>
            ): null}
        <UserButton 
        afterSignOutUrl="/"/>
    </div>
    </> );
}
 
export default NavbarRoutes;