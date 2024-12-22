import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import VideoPlayer from "./_components/VideoPlayer";
import CourseEnrollButton from "./_components/CourseEnrollButton";
import { Separator } from "@radix-ui/react-separator";
import { File } from "lucide-react";



const ChapterPlayerPage = async ({params}:{
    params:{
        courseId: string,
        chapterId: string
    }
}) => {

    const {userId} = await auth();

    if(!userId){
        return redirect("/");
    }

    const{
        chapter,
        course,
        muxData,
        attachments,
        nextChapter,
        userProgress,
        purchase,
     } = await getChapter({
        userId,
        courseId: params.courseId,
        chapterId: params.chapterId
    });

    if(!chapter || !course){
        return redirect("/");
    }

    const isLocked = !chapter.isFree && !purchase;
    const completedOnEnd=!!purchase && !userProgress?.isCompleted;

    return ( <div>
        <div>
            {userProgress?.isCompleted && (
                <Banner variant="success" label="You Already Completed This Course"/>
            )}
            {isLocked && (
                <Banner variant="warning" label="You Need To Purchase This Course to what this chapter"/>
            )}
            <div className="flex flex-col max-w-4xl mx-auto pb-20">
                <div className="p-4">
                    <VideoPlayer 
                    chapterId={params.chapterId}
                    title={chapter.title}
                    courseId={params.courseId}
                    nextChapterId={nextChapter?.id}
                    playbackId={muxData?.playbackId!}
                    isLocked={isLocked}
                    completedOnEnd={completedOnEnd}
                    />
                </div>
                <div className="p-4 flex flex-col md:flex-row items-center justify-between">
        <h2 className="text-2xl font-semibold mb-2">{chapter.title}</h2>
        {purchase ? (
          <div>{/* TODO: Add progress UI */}</div>
        ) : (
          <CourseEnrollButton courseId={params.courseId} price={course.price!} />
        )}
      </div>
      <Separator />
      <div>
        {chapter.description}
     </div>
      {!!attachments.length && (
        <>
        <Separator />
        <div className="p-4">
            {attachments.map((attachment) => (
                <a href={attachment.url}
                    target="_blank"
                    key={attachment.id}
                    className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline">
                        <File />``
                        <p className="line-clamp-1">
                            {attachment.name}
                        </p>
                </a> ))}

        </div>
        </>
    
      )}
            </div>
        </div>
    </div> );
}
 
export default ChapterPlayerPage;