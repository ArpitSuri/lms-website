
import { db } from "@/lib/db";
import Categories from "./_components/categories";
import SearchInput from "@/components/searchInput";
import { get } from "http";
import { getCourses } from "@/actions/get-courses";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CoursesList from "@/components/CoursesList";


interface SearchPageProps {
    searchParams:{
        title:string;
        categoryId:string;
    }
}


const SearchPage =  async({searchParams}:SearchPageProps) => {
    const categories = await db.category.findMany({
        orderBy:{
            name:"asc"
        }
    })

    const {userId} = await auth();
    if(!userId){
        return redirect("/")}

    const courses =await getCourses({
        userId,
        ...searchParams ,
       })
    return ( 
        <>
        <div className="px-6 pt-6 md:hidden md:mb-0 block">
            <SearchInput />
        </div>
        <div className="p-6">
            <Categories 
            items={categories} /> 
            <CoursesList items={courses} />
        </div>
        </>
      );
}
 
export default SearchPage;