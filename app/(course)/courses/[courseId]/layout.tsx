import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CourseSlidebar from "./_components/CourseSidebar";
import CourseNavBar from "./_components/CourseNavbar";

const CourseLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) => {
  const { userId } = await auth();

  // Redirect if the user is not authenticated
  if (!userId) {
    return redirect("/");
  }

  // Fetch the course details
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        include: {
          userProgress: {
            where: {
              userId,
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  // Redirect if the course does not exist
  if (!course) {
    return redirect("/");
  }

  // Get the progress count
  const progressCount = await getProgress(userId, params.courseId);

  return (
    <div className="h-full flex flex-col">
      {/* Navbar */}
      <div className="h-[80px] fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <CourseNavBar course={course} progressCount={progressCount} />
      </div>

      {/* Sidebar */}
      <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 left-0 z-40 bg-gray-100 shadow-md">
        <CourseSlidebar course={course} progressCount={progressCount} />
      </div>

      {/* Main Content */}
      <main className="flex-1 mt-[80px] md:ml-80 p-4">
        {children}
      </main>
    </div>
  );
};

export default CourseLayout;
