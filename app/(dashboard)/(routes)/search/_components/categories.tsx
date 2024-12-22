"use client"
import {IconType} from "react-icons";

import{
    FcMusic,
    FcMultipleDevices,
    FcSalesPerformance,
    FcSportsMode,
} from "react-icons/fc";

import { Category } from "@prisma/client";
import CategoryItem from "./categoryItem";
interface CategoriesProps{
    items:Category[];
}

const iconMap:Record<Category["name"] , IconType >={
    "Software Service":FcMultipleDevices,
    "music":FcMusic,
    "finance":FcSalesPerformance,
    "sports":FcSportsMode,
    "fitness":FcSportsMode,

}
const Categories = ({items,}:CategoriesProps) => {
    return (  
        <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
            {items.map((item)=>(
                <CategoryItem 
                key ={item.id}
                label={item.name}
                icon={iconMap[item.name]}
                value = {item.id}/>
            ))}
            
        </div>
    );
}
 
export default Categories;