import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: { courseId: string } }) {
  try {
    const { userId } = await auth();

    // Check for user authentication
    if (!userId) {
      return new NextResponse("Unauthorized: No user authenticated", { status: 401 });
    }

    let list;
    try {
      // Parse JSON body and validate
      list = await req.json();
    } catch (err) {
      return new NextResponse("Invalid JSON body", { status: 400 });
    }

    // Validate 'list' is an array
    if (!Array.isArray(list)) {
      return new NextResponse("Invalid data format for list. Must be an array.", { status: 400 });
    }

    // Verify the course ownership
    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized: You do not own this course", { status: 401 });
    }

    // Validate and update chapters
    for (let item of list) {
      if (!item.id || typeof item.position !== "number") {
        return new NextResponse(
          "Invalid item data. Each item must have an 'id' and a numeric 'position'.",
          { status: 400 }
        );
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
