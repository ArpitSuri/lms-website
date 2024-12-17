import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = await auth();

    // Check if the user is authenticated
    if (!userId) {
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
