'use client'; // Make this component a Client Component

import { BarChart, List } from "lucide-react";
import { SidebarItems } from "./SideBarItem";
import { usePathname } from "next/navigation";

const guestRoute = [
    { icon: "Layout", label: "Dashboard", href: "/" },
    { icon: "Compass", label: "Browse", href: "/search" },
];


const TeacherRoute = [
    { icon: "List", label: "Courses", href: "/teacher/courses" },
    { icon: "BarChart", label: "Analystics", href: "/teacher/analytics" },
];  
export const SidebarRoutes = () => {
    
    const pathname =  usePathname();
    const isTeacherPage = pathname?.includes("/teacher");

    const routes = isTeacherPage ? TeacherRoute : guestRoute   ;

    return (
        <div className="flex flex-col w-full">
            {routes.map((route) => (
                <SidebarItems
                    key={route.href}
                    icon={route.icon} // Pass icon as a string
                    label={route.label}
                    href={route.href}
                />
            ))}
        </div>
    );
};
