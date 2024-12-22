import { db } from "@/lib/db";
import { Category, Chapter, Course } from "@prisma/client";
import { getProgress } from "./get-progress";

type CoursesWithProgressWithCategory = Course & {
  category: Category;
  chapters: Chapter[];
  progress: number | null;
};

type DashboardCourses = {
  completedCourses: CoursesWithProgressWithCategory[];
  coursesInProgress: CoursesWithProgressWithCategory[];
};

export const getDashboardCourses = async (userId: string): Promise<DashboardCourses> => {
  try {
    const purchasedCourses = await db.purchase.findMany({
      where: {
        userId: userId,
      },
      select: {
        course: {
          include: {
            category: true,
            chapters: {
              where: {
                isPublished: true,
              },
            },
          },
        },
      },
    });

    // Extract courses from purchases
    const courses = purchasedCourses.map((purchase) => ({
      ...purchase.course,
      progress: null, // Initialize progress to null
    })) as CoursesWithProgressWithCategory[];

    // Fetch progress for each course concurrently
    const coursesWithProgress = await Promise.all(
      courses.map(async (course) => {
        const progress = await getProgress(userId, course.id);
        return { ...course, progress };
      })
    );

    // Filter completed and in-progress courses
    const completedCourses = coursesWithProgress.filter((course) => course.progress === 100);
    const coursesInProgress = coursesWithProgress.filter((course) => (course.progress ?? 0) < 100);

    return {
      completedCourses,
      coursesInProgress,
    };
  } catch (error) {
    console.error("Error in Get Dashboard Courses", error);
    return {
      completedCourses: [],
      coursesInProgress: [],
    };
  }
};
