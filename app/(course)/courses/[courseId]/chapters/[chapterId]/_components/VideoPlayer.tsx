"use client";

import { cn } from "@/lib/utils";
import MuxPlayer from "@mux/mux-player-react";
import { Loader2, Lock } from "lucide-react";
import { useState } from "react";


interface VideoPlayerProps {
  playbackId: string;
  chapterId: string;
  courseId: string;
  nextChapterId?: string;
  isLocked: boolean;
  completedOnEnd: boolean;
  title: string;
  purchase?: boolean; // Added optional purchase prop
  price?: number; // Added optional price prop
}

const VideoPlayer = ({
  playbackId,
  chapterId,
  courseId,
  nextChapterId,
  isLocked,
  completedOnEnd,
  title,
  purchase,
  price,
}: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);

  const handleVideoEnd = () => {
    if (completedOnEnd) {
      console.log(`Video ${chapterId} completed for course ${courseId}`);
      // Add any additional completion logic here
    }
  };

  return (
    <div className="relative aspect-video">
      {isLocked ? (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
          <Lock className="h-8 w-8" />
          <p className="text-sm">This Chapter Is Locked</p>
        </div>
      ) : !isReady ? (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="h-8 w-8 animate-spin text-secondary" />
        </div>
      ) : null}

      {!isLocked && (
        <MuxPlayer
          title={title}
          className={cn(!isReady && "hidden")}
          onCanPlay={() => setIsReady(true)}
          onEnded={handleVideoEnd}
          autoPlay
          playbackId={playbackId}
        />
      )}


    </div>
  );
};

export default VideoPlayer;
