import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import VideoPlayer from "./_components/VideoPlayer";



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

            </div>
        </div>
    </div> );
}
 
export default ChapterPlayerPage;