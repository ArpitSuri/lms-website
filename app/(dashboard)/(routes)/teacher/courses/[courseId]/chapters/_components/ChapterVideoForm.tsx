"use client";

import * as z from "zod";
import { Button } from "@/components/ui/button";
import { ImageIcon, Pencil, PlusCircle, Video } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import Image from "next/image";
import { FileUpload } from "@/components/file-upload";
import { Chapter, Course, MuxData } from "@prisma/client";
import axios from "axios";
import MuxPlayer from "@mux/mux-player-react";

interface ChapterVideoFormProps {
  initialData: Chapter & {muxData? : MuxData | null}; // Directly using Course type
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  videoUrl: z
    .string()
    .min(1, { message: "Video  is required" }),
});

export const ChapterVideoForm = ({ initialData, courseId  , chapterId}: ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const toggleEdit = () => setIsEditing((current) => !current);

  const formMethods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
     videoUrl: initialData?.videoUrl || "", 
    },
  });

  const { handleSubmit } = formMethods;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
      toast.success("Video updated successfully!");
      toggleEdit();
      router.refresh();
    } catch (error) {
      console.error("Error updating video:", error);
      toast.error("Something went wrong while updating the video.");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Video
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a Video
            </>
          )}
          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Video
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        !initialData.videoUrl ? (
          <div className="flex items-center justify-center bg-slate-200 rounded-md h-60">
            <Video className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <MuxPlayer playbackId={initialData?.muxData?.playbackId || ""} />
          </div>
        )
      )}

      {isEditing && (
        <div>
          <FileUpload
            endpoint="chapterVideo"
            onChange={(url) => onSubmit({ videoUrl: url })}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Upload This Chapter's Video
          </div>
        </div>
      )}
      {initialData.videoUrl && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2">
          Videos can take a few minutes to process . Refresh the page if video does not appear.
        </div>
      )}
    </div>
  );
};
