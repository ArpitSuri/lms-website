"use client"

import { cn } from "@/lib/utils";
import MuxPlayer from "@mux/mux-player-react";
import { Loader2, Lock } from "lucide-react";
import { useState } from "react";

interface VideoPlayerProps{
    playbackId: string;
    chapterId: string;
    courseId: string;
    nextChapterId?: string;
    isLocked: boolean;
    completedOnEnd: boolean;
    title: string;
}


const VideoPlayer = ({
    playbackId,
    chapterId,
    courseId,
    nextChapterId,
    isLocked,
    completedOnEnd,
    title
}:VideoPlayerProps) => {
    const [isReady, setIsReady] = useState(false);
    return ( 
        <div className="relative aspect-video">
            {!isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                    <Loader2 className="h-8 w-8 animate-spin text-secondary" />
                </div>
            )}
            {isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
                    <Lock className="h-8 w-8" />
                    <p className="text-sm">
                        This Chapter Is Locked
                    </p>
                </div>
            )}
            {!isLocked && (
                <MuxPlayer 
                title={title}
                className={cn(
                    !isReady && "hidden"
                )} 
                onCanPlay={()=>setIsReady(true)}
                onEnded={()=>{}}
                autoPlay
                playbackId={playbackId}/>
            )}
            
        </div>
     );
}
 
export default VideoPlayer;