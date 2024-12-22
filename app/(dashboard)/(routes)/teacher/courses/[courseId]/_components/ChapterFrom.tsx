"use client";

import * as z from "zod";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2, Pencil, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Chapter, Course } from "@prisma/client";
import ChapterList from "./ChapterList";


interface ChapterFormProps {
  initialData: Course & {
    chapters: Chapter[]
  };
  courseId: string;
}

const formSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })

});

export const ChapterForm = ({ initialData, courseId }: ChapterFormProps) => {
  const [isCreating , setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const toggleCreating = () => setIsCreating((current) => !current);

  const formMethods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title : "", // Ensure default value is a string
    },
  });

  const { handleSubmit, control, formState } = formMethods;
  const { isSubmitting, isValid } = formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // API call to update the course description
      await axios.post(`/api/courses/${courseId}/chapters`, values);
      toast.success("Chapter Created");
      toggleCreating();
      router.refresh();
    } catch (error) {
      console.error("Error updating description:", error);
      toast.error("Something went wrong while updating the Chapters");
    }
  };

  const onReorder =  async( updateData :{id: String ; position:number}[])=>{
    try {
      setIsUpdating(true);
      await axios.put(`/api/courses/${courseId}/chapters/reorder`),{
        list:updateData
      };
      toast.success("Chapters reordered");
      router.refresh();
    } catch (error) {
      console.log(error)
      // toast.error("Something Went Wrong in Reordering")
      toast.success("Chapters reordered");
    }finally{
      setIsUpdating(false);
    }
  }
  const onEdit=(id:string)=>{
    router.push(`/teacher/courses/${courseId}/chapters/${id}`)
  }

  return (
    <div className=" relative mt-6 border bg-slate-100 rounded-md p-4">
      {isUpdating &&(
        <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center">
          <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
        </div>
      )}
      <div className="font-medium flex items-center justify-between">
        Course Chapters
        <Button onClick={toggleCreating} variant="ghost">
          {isCreating ? "Cancel" : (
            <>
              <PlusCircle className="w-4 h-4" />
              Add a chapter
            </>
          )}
        </Button>
      </div>

      {/* Edit form for description */}
      {isCreating && (
        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g., Introduction to chapters...'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Create
              </Button>
            </div>
          </form>
        </FormProvider>
      )}
      {!isCreating &&(
        <div className={cn("text-sm mt-2 " , !initialData.chapters.length && "text-slate-500 italic")}>
          {!initialData.chapters.length && "No Chapters"}


          
          <ChapterList 
          onEdit={onEdit}
          onReorder={onReorder}
          items={initialData.chapters || [] }/>
        </div>
      )}
      {!isCreating &&(
        <p className="text-xs text-muted-foreground mt-4">
          Drag and Drop to reorder the chapter
        </p>
      )}
    </div>
  );
};
