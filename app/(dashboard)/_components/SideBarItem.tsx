'use client';

import { Layout, Compass } from "lucide-react"; // Import the actual icons
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";

// Define valid icon names as a union type
type IconName = "Layout" | "Compass";

interface SidebarItemsProps {
    icon: IconName; // Restrict icon to valid keys
    label: string;
    href: string;
}

// Map icon names to their corresponding components
const iconComponents: Record<IconName, React.ComponentType<any>> = {
    Layout,
    Compass,
};

export const SidebarItems = ({ icon, label, href }: SidebarItemsProps) => {
    const pathname = usePathname();
    const router = useRouter();

    // Resolve the icon component from the icon name
    const Icon = iconComponents[icon];

    // Determine active state
    const isActive =
        (pathname === "/" && href === "/") ||
        pathname === href ||
        pathname?.startsWith(`${href}/`);

    const onClick = () => {
        router.push(href);
    };

    return (
        <button
            onClick={onClick}
            type="button"
            className={cn(
                "flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
                isActive &&
                    "text-sky-700 bg-sky-200/20 hover:bg-sky-200/20 hover:text-sky-700"
            )}
        >
            <div className="flex items-center gap-x-2 py-4">
                {Icon && (
                    <Icon
                        size={22}
                        className={cn(
                            "text-slate-500",
                            isActive && "text-sky-700"
                        )}
                    />
                )}
                {label}
            </div>
            <div className={cn(
                "ml-auto opacity-0 border-2 border-sky-700 h-full transition-all" , isActive && "opacity-100"
            )} />
        </button>
    );
};
