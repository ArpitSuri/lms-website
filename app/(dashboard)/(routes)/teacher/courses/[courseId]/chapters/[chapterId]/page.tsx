import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import ChaptertitleForm from "../_components/Chaptertitleform";
import ChapterDescriptionForm from "../_components/ChapterDescription";
import ChapterAccessForm from "../_components/ChapteraccessForm";
import { ChapterVideoForm } from "../_components/ChapterVideoForm";
import { Banner } from "@/components/banner";
import { ChapterActions } from "../_components/ChapterActions";


const ChapterPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string }; // Fixed type casing
}) => {
  // Fetch the userId from auth
  const { userId } =  await auth(); // Removed `await` because `auth` does not need to be awaited in most Clerk setups.

  // Redirect if no userId is found
  if (!userId) {
    redirect("/"); // No need to `return` here since `redirect` halts execution.
  }

  // Fetch chapter from the database
  const chapter = await db.chapter.findUnique({
    where: {
      id: params.chapterId, // Ensure these fields match the DB schema
      courseId: params.courseId,
    },
    include: {
      muxData: true, // Assuming this relationship exists in Prisma schema
    },
  });

  // Redirect if no chapter exists
  if (!chapter) {
    redirect("/");
  }

  // Check for required fields completion
  const requiredFields = [
    chapter.title,
    chapter.description,
    chapter.videoUrl, 
  ];

  const totalFields = requiredFields.length; // Fixed typo: `totalField` to `totalFields`
  const completedFields = requiredFields.filter(Boolean).length;

  const completionFields = `(${completedFields}/${totalFields})`; // Final string for completion status

  const isComplete = requiredFields.every(Boolean);

  // JSX Render
  return (
    <>
    {!chapter.isPublished && (
      <Banner
      variant="warning"
      label="This chapter is unpublished . It will not visible in the course " />
    )}
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="w-full">
          <Link
            href={`/teacher/courses/${params.courseId}`}
            className="flex items-center text-sm hover:opacity-75 transition mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to course Setup
          </Link>
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">
                    Chapter Creation
                </h1>
                <span className="text-sm text-slate-700">
                    Complete all fields {completionFields}
                </span>
            </div>
            <ChapterActions  
            disabled ={!isComplete}
            courseId={params.courseId}
            chapterId={params.chapterId}
            isPublished={chapter.isPublished}
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div className="space-y-4">
            <div>
                <div className="flex items-center gap-x-2">
                    <IconBadge icon={LayoutDashboard} />
                    <h2 className="text-xl">
                        Customize your chapter
                    </h2>
                </div>
                <ChaptertitleForm
                initialData={chapter}
                courseId={params.courseId}
                chapterId={params.chapterId} />

                <ChapterDescriptionForm
                initialData={chapter}
                courseId={params.courseId}
                chapterId={params.chapterId} />

            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Eye} />
                <h2 className="text-xl">
                  Access Settings
                </h2>
              </div>
              <ChapterAccessForm 
              initialData={chapter}
              courseId={params.courseId}
              chapterId={params.chapterId} />
            </div>
        </div>

        <div className="flex  flex-col items-start gap-x-2">
          <IconBadge icon={Video} />
          <h2 className="text-xl">
            Add a video
          </h2>
          <ChapterVideoForm 
          initialData={chapter}
              courseId={params.courseId}
              chapterId={params.chapterId} />

        </div>
      </div>
    </div>
    </>
  );
};

export default ChapterPage;
