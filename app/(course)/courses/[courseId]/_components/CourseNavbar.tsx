

import NavbarRoutes from "@/components/NavbarRoutes";
import { Chapter, Course, UserProgress } from "@prisma/client";
import CourseMobileSidebar from "./CourseMobileSidebar";

interface CourseNavBarProps {
    course: Course &{
        chapters:(Chapter &{
            userProgress : UserProgress[] |null;
        })[];
    };
    progressCount:number;
}


const CourseNavBar = ({course , progressCount}:CourseNavBarProps) => {
    return (  
        <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
            <CourseMobileSidebar 
            course={course}
            progressCount={progressCount} />
            <NavbarRoutes />

        </div>
    );
}
 
export default CourseNavBar;