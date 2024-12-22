import Mux from "@mux/mux-node"; 
import { db } from "@/lib/db"; 
import { auth } from "@clerk/nextjs/server"; 
import { NextResponse } from "next/server"; 

// Initialize Mux and Video
const mux = new Mux({
    tokenId: process.env["MUX_TOKEN_ID"],
    tokenSecret: process.env["MUX_TOKEN_SECRET"],
});
const video = mux.video; // Accessing video with lowercase 'v'

// DELETE function to remove a chapter
export async function DELETE(req: Request, { params }: { params: { courseId: string; chapterId: string } }) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized: No user authenticated", { status: 401 });
        }

        // Check if the user owns the course
        const ownCourse = await db.course.findUnique({
            where: { id: params.courseId, userId: userId },
        });
        if (!ownCourse) {
            return new NextResponse("Unauthorized: You do not own this course", { status: 401 });
        }

        // Fetch the chapter
        const chapter = await db.chapter.findUnique({
            where: { id: params.chapterId, courseId: params.courseId },
        });
        if (!chapter) {
            return new NextResponse("Not Found", { status: 404 });
        }

        let deletedChapter = null;

        // If the chapter has a video URL, delete the associated Mux asset and database entries
        if (chapter.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: { chapterId: params.chapterId },
            });
            if (existingMuxData) {
                // Delete Mux asset using the correct method
                await video.assets.destroy(existingMuxData.assetId); // Use destroy method
                // Delete Mux data entry
                await db.muxData.delete({ where: { id: existingMuxData.id } });
            }
            // Delete the chapter
            deletedChapter = await db.chapter.delete({ where: { id: params.chapterId } });

            // Check if any published chapters remain, and update course publish status if needed
            const publishedChapterInCourse = await db.chapter.findMany({
                where: { courseId: params.courseId, isPublished: true },
            });
            if (!publishedChapterInCourse.length) {
                await db.course.update({
                    where: { id: params.courseId },
                    data: { isPublished: false },
                });
            }
        }

        return NextResponse.json(deletedChapter);
    } catch (error) {
        console.error("[CHAPTER_ID_DELETE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

// PATCH function to update a chapter
export async function PATCH(req: Request, { params }: { params: { courseId: string; chapterId: string } }) {
    try {
        const { userId } = await auth();
        const { isPublished, ...values } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized: No user authenticated", { status: 401 });
        }

        // Check if the user owns the course
        const ownCourse = await db.course.findUnique({
            where: { id: params.courseId, userId: userId },
        });
        if (!ownCourse) {
            return new NextResponse("Unauthorized: You do not own this course", { status: 401 });
        }

        // Update chapter with new values
        const chapter = await db.chapter.update({
            where: { id: params.chapterId, courseId: params.courseId },
            data: { ...values },
        });

        // Handle video URL update if provided
        if (values.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: { chapterId: params.chapterId },
            });

            if (existingMuxData) {
                // Delete existing Mux asset using the correct method
                await video.assets.destroy(existingMuxData.assetId); // Use destroy method
                // Delete corresponding Mux data entry
                await db.muxData.delete({ where: { id: existingMuxData.id } });
            }

            // Create new Mux asset
            const asset = await video.assets.create({
                input: values.videoUrl,
                playback_policy: ["public"], // Set playback policy
                test: false, // Ensure test mode is disabled if necessary
            });

            // Save new Mux asset data to the database
            await db.muxData.create({
                data: {
                    chapterId: params.chapterId,
                    assetId: asset.id,
                    playbackId: asset.playback_ids?.[0]?.id,
                },
            });
        }

        return NextResponse.json(chapter);
    } catch (error) {
        console.error("[CHAPTER_PATCH_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
