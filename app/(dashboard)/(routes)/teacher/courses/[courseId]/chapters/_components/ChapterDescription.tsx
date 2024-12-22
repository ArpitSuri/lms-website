"use client";

import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

interface ChapterDescriptionFormProps {
  initialData: {
    description: string | null;
  };
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  description: z.string().min(1, {
    message: "description is required",
  }),
});

const ChapterDescriptionForm = ({ initialData, courseId , chapterId}: ChapterDescriptionFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const formMethods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData.description || "", // Ensure default value is a string
    },
  });

  const { handleSubmit, control, formState } = formMethods;
  const { isSubmitting, isValid } = formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
      toast.success("description of chapter updated");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter description
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && (
            <>
              <Pencil className="w-4 h-4" />
              Edit description
            </>
          )}
        </Button>
      </div>
      {!isEditing && <p className="text-sm mt-2">{initialData.description}</p>}
      {isEditing && (
        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'Introduction to the course'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
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

export default ChapterDescriptionForm;
