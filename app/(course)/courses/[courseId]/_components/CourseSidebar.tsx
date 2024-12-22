import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Chapter, Course, UserProgress } from "@prisma/client";
import { redirect } from "next/navigation";
import CourseSidebarItem from "./CourseSicebarItem";


interface CourseSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
}

const CourseSidebar = async ({ course, progressCount }: CourseSidebarProps) => {
  const { userId } = await auth();

  // Redirect if not authenticated
  if (!userId) {
    return redirect("/");
  }

  // Fetch user purchase for the course
  let purchase = null;
  try {
    purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: course.id,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching purchase data:", error);
  }

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
      {/* Course Title */}
      <div className="p-8 flex flex-col border-b">
        <h1 className="font-semibold">{course.title}</h1>
      </div>

      {/* Course Chapters */}
      <div className="flex flex-col w-full">
        {course.chapters.map((chapter) => (
          <CourseSidebarItem
            key={chapter.id}
            id={chapter.id}
            isCompleted={!!chapter.userProgress?.[0]?.isCompleted || false}
            courseId={course.id}
            isLocked={!chapter.isFree && !purchase}
            label={chapter.title} // Ensure `label` is passed
          />
        ))}
      </div>
    </div>
  );
};

export default CourseSidebar;
