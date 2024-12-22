import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function PATCH(req: Request, { params }: { params: { courseId: string  , chapterId: string} }) {
    try {
      const { userId } = await auth();
  
      if (!userId) {
          return new NextResponse("Unauthorized: No user authenticated", { status: 401 });
        }
  
  
      // Find the course owned by the user
      const ownCourse = await db.course.findUnique({
        where: {
          id: params.courseId,
          userId: userId,
        },
      });
  
      if (!ownCourse) {
        return new NextResponse("Unauthorized: You do not own this course", { status: 401 });
      }

      const chapter= await db.chapter.findUnique({
        where:{
            id:params.chapterId,
            courseId:params.courseId,
        }
      })

      const unpublishedChapter = await db.chapter.update({
        where:{
            id:params.chapterId,
            courseId:params.courseId,
        },
        data:{
            isPublished: true ,
        }
      })

      const publishedChapterInCourse= await db.chapter.findMany({
        where:{
          courseId:params.courseId,
          isPublished:true
        }
      });
      if(!publishedChapterInCourse.length){
        await db.course.update({
          where:{
            id:params.courseId,
          },
          data:{
            isPublished:false,
          }
        })
      }
  
      return NextResponse.json(unpublishedChapter)
    } catch (error) {
      console.error("[CHAPTER_UNPUBLISH]", error);
      return new NextResponse("Internal Error: Something went wrong", { status: 500 });
    }
  }
  