import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs/server";
import Mux from "@mux/mux-node";
import { NextResponse } from "next/server";

// Initialize Mux and Video
const mux = new Mux({
  tokenId: process.env["MUX_TOKEN_ID"],
  tokenSecret: process.env["MUX_TOKEN_SECRET"],
});
const video = mux.video; // Accessing video with lowercase 'v'


export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string } }
){
  try {
    const { userId } = await auth();

    // Check if the user is authenticated
    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

  const course = await db.course.findUnique({
    where:{
      id: params.courseId,
      userId : userId,
    },
    include:{
      chapters:{
        include:{
          muxData:true,
        }
      }
    }
  })

    // Validate courseId
    if (!course) {
      return new NextResponse("Course Not Found", { status: 404 });
    }
    for (const chapter of course.chapters){
      if(chapter.muxData?.assetId){
        await video.assets.destroy(chapter.muxData.assetId);
      }
    }

    const deletedCourse =  await db.course.delete({
      where:{
        id:params.courseId,
      },
    });

    return NextResponse .json(deletedCourse);
  } catch (error) {
    console.log("[COURSE_ID_DELETE]" , error);
    return new NextResponse("InterNal Error" , {status:500});
    
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = await auth();

    // Check if the user is authenticated
    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { courseId } = params;

    // Validate courseId
    if (!courseId) {
      return new NextResponse("Course ID is required", { status: 400 });
    }

    // Parse request body
    const values = await req.json();

    // Update course in the database
    const course = await db.course.update({
      where: {
        id: courseId,
        userId: userId, // Ensure the course belongs to the user
      },
      data: {
        ...values, // Spread the updates
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[PATCH /api/courses/:courseId] Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
