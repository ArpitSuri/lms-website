"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

interface ChapterAccessFormProps {
  initialData: {
    description: string | null;
  };
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  isFree :z.boolean().default(false) ,
});

const ChapterAccessForm = ({ initialData, courseId , chapterId}: ChapterAccessFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const formMethods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isFree:  !! initialData.isFree
    },
  });

  const { handleSubmit, control, formState } = formMethods;
  const { isSubmitting, isValid } = formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
      toast.success("Preview Settings Updated");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter Access Settings
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && (
            <>
              <Pencil className="w-4 h-4" />
              Edit Access
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p className={cn("text-sm mt-2" ,!initialData.isFree && "text-slate-500 italic")}>
          {initialData.isFree ?(
            <>This Chapter is free for preview.</>
          ):(
            <>This Chapter is not free</>
          )}
        </p>
      )}




      {isEditing && (
        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={control}
              name="isFree"
              render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value}
                      onCheckedChange={field.onChange}  />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormDescription>
                        Check this box if you want to makw this chapter free for preview
                      </FormDescription>
                    </div>
                  </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </FormProvider>
      )}
    </div>
  );
};

export default ChapterAccessForm;
