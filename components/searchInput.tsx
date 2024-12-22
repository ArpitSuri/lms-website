"use client"

import { Search } from "lucide-react";
import { Input } from "./ui/input";
import qs from "query-string";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const SearchInput = () => {

    const[value,setValue]=useState("");
    const debouncedValue = useDebounce(value, 500);
    
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname=usePathname();

    const currentCategoryId = searchParams.get("CategoryId");
    useEffect(() => {
        const url = qs.stringifyUrl({
            url: pathname,
            query: {
                title: debouncedValue,
                categoryId: currentCategoryId,
            }
            },{skipNull:true,skipEmptyString:true});
            router.push(url);
    },[debouncedValue , currentCategoryId , router , pathname]);  


    return ( <div className="relative">
        <Search className="h-4 w-4 absolute top-3 left-3 text-slate-600" />
        <Input
        onChange={(e)=>setValue(e.target.value)}
        value={value} 
        
        className="w-full md:w-[300] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200" placeholder="Search For A course" />
    </div>  );
}
 
export default SearchInput;