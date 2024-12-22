import { db } from "@/lib/db"

export const getProgress = async (userId:string , courseId:string) :Promise<number>=> {
    try {
        const publishedChapters = await db.chapter.findMany({
            where: {
                courseId : courseId,
                isPublished : true
            },select:{
                id:true
            } });
            const publishedChaptersIds = publishedChapters.map(chapter => chapter.id);
            const validCompletedChapters = await db.userProgress.findMany({
                where: {
                    chapterId : {
                        in : publishedChaptersIds
                    },
                    userId : userId,
                    isCompleted : true
                }
            });

            const progressPercentage = (validCompletedChapters.length / publishedChapters.length) * 100;

            return progressPercentage;
    } catch (error) {
        console.log("Get Progress Error", error)
        return 0
        
    }

}