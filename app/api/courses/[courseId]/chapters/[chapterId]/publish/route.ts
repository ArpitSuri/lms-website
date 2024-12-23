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

      const muxData = await db.muxData.findUnique({
        where:{
            chapterId:params.chapterId,
        }
      });

      if(!chapter || !muxData || !chapter.title || 
        !chapter.description || !chapter.videoUrl
      ){
        return new NextResponse("Missing Required Fields" , {status :400});
      }

      const publishedChapter = await db.chapter.update({
        where:{
            id:params.chapterId,
            courseId:params.courseId,
        },
        data:{
            isPublished: true ,
        }
      })
      return NextResponse.json(publishedChapter)
  
  
    } catch (error) {
      console.error("[CHAPTER_PUBLISH]", error);
      return new NextResponse("Internal Error: Something went wrong", { status: 500 });
    }
  }
  