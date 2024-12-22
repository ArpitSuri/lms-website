import { IconBadge } from "@/components/icon-badge";
import { LucideIcon } from "lucide-react";


interface InfoCardProps{
    number0fItems:number;
    variant?:"default" | "success";
    label: string;
    icon:LucideIcon;
}

const InfoCard = ({
    variant,
    icon:Icon,
    number0fItems,
    label
}:InfoCardProps) => {
    return ( <div className="border rounded-md flex items-center gap-x-2 p-3">
        <IconBadge variant={variant} icon={Icon} />
        <div>
            <p className="font-medium">
                {label}
            </p>
            <p className="text-gray-500 text-sm">
                {number0fItems} {number0fItems===1 ? "Course" : "Courses"}
            </p>
        </div>
    </div> );
}




 
export default InfoCard;