import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: { courseId: string } }) {
  try {
    const { userId } = await auth();

    const { list } = await req.json();
    if (!userId) {
        return new NextResponse("Unauthorized: No user authenticated", { status: 401 });
      }
    // Ensure list is an array
    if (!Array.isArray(list)) {
      return new NextResponse("Invalid data format for list", { status: 400 });
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

    // Update the chapter positions
    for (let item of list) {
      if (!item.id || typeof item.position !== 'number') {
        return new NextResponse("Invalid item data", { status: 400 });
      }
      await db.chapter.update({
        where: { id: item.id },
        data: { position: item.position },
      });
    }

    return new NextResponse("Success: Chapters reordered", { status: 200 });

  } catch (error) {
    console.error("[Reorder Error]", error);
    return new NextResponse("Internal Error: Something went wrong", { status: 500 });
  }
}
