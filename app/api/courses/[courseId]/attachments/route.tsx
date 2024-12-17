import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { courseId: string } }) {
    try {
        const { userId } = await auth();
        const { url } = await req.json();

        // Check if user is authenticated
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Check if the course exists and belongs to the user
        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId,
            },
        });

        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Validate URL
        if (!url || typeof url !== "string" || !url.includes("/")) {
            return new NextResponse("Invalid URL", { status: 400 });
        }

        // Create attachment
        const attachment = await db.attachment.create({
            data: {
                url,
                name: url.split("/").pop() || "default_name", // Default name fallback if URL is malformed
                courseId: params.courseId,
            },
        });

        // Return success response with the created attachment data
        return NextResponse.json(attachment, { status: 201 });

    } catch (error) {
        console.error("Course_id_Attachments", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
