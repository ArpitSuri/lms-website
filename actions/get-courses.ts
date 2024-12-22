// import { Category, Course } from "@prisma/client";

// type CourseWithPrigresWithCategory= Course & {
//     category: Category | null;
//     chapters: { id:string }[];
//     progress:number;};

//     type GetCourses ={
//         userId:string;
//         title?:string;
//         categoryId?:string;
//     }

//     export const getCourses = async ({userId,title,categoryId}:GetCourses):Promise<CourseWithPrigresWithCategory[]>=>{try{
//         const courses = await db.course.findMany({
//             where:{
//                 title:{
//                     contains:title
//                 },
//                 categoryId:categoryId,
//             },
//             include:{
//                 category:true,
//                 chapters:{
//                     where:{
//                         isPublished:true
//                     },
//                     select:{
//                         id:true
//                     }
//                 },
//                 purchases:{
//                     where:{
//                         userId
//                     }
//                 }
//             },
//             orderBy:{
//                 createdAt:"desc"
//             }
//         });
//         const coursesWithProgress : CourseWithPrigresWithCategory[] = await Promise.all(courses.map(async course=>{ 
//             if(course.purchases.length === 0){  return {...course,progress:null};
//         }
//         const progress = await getProgress(userId,course.id);})
//         return {...course,progress};
//          ;
//     return coursesWithProgress;
//     }catch(error){
//         console.log("Get Courses Error",error);
//         return [];
//     }

import { Category, Course } from "@prisma/client";
import { getProgress } from "./get-progress";
import { db } from "@/lib/db";

type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

type GetCourses = {
  userId: string;
  title?: string;
  categoryId?: string;
};

export const getCourses = async ({
  userId,
  title,
  categoryId,
}: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
  try {
    const courses = await db.course.findMany({
      where: {
        title: title ? { contains: title } : undefined,
        categoryId: categoryId || undefined,
      },
      include: {
        category: true,
        chapters: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          },
        },
        purchases: {
          where: {
            userId,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const coursesWithProgress: CourseWithProgressWithCategory[] = await Promise.all(
      courses.map(async (course) => {
        const progress =
          course.purchases.length === 0
            ? null
            : await getProgress(userId, course.id);

        return { ...course, progress };
      })
    );

    return coursesWithProgress;
  } catch (error) {
    console.error("Get Courses Error", error);
    return [];
  }
};
