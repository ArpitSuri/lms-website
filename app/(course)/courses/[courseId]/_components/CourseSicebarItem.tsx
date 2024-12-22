"use client";

import { cn } from "@/lib/utils";
import { CheckIcon, PlayCircle, Lock } from "lucide-react"; // Ensure Lock is imported
import { usePathname, useRouter } from "next/navigation";

interface CourseSidebarItemProps {
  label: string;
  id: string;
  isCompleted: boolean;
  isLocked: boolean;
  courseId: string;
}

const CourseSidebarItem = ({
  label,
  id,
  isCompleted,
  isLocked,
  courseId,
}: CourseSidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  // Ensure Icon is defined properly
  const Icon = isLocked ? Lock : isCompleted ? CheckIcon : PlayCircle;
  const isActive = id && pathname?.includes(id);

  const onClick = () => {
    if (!isLocked) {
      router.push(`/courses/${courseId}/chapters/${id}`);
    }
  };

  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
        isActive && "text-slate-700 bg-slate-200/20 hover:bg-slate-200/20",
        isCompleted && "text-emerald-700 hover:text-emerald-700",
        isCompleted && isActive && "bg-emerald-200/20"
      )}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon
          size={22}
          className={cn(
            "text-slate-500",
            isActive && "text-slate-700",
            isCompleted && "text-emerald-700"
          )}
        />
        <p>{label}</p>
      </div>
      <div
        className={cn(
          "ml-auto opacity-0 border-2 border-slate-700 h-full transition-all",
          isActive && "opacity-100",
          isCompleted && "border-emerald-700"
        )}
      />
    </button>
  );
};

export default CourseSidebarItem;
