"use client";

import * as z from "zod";
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
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

interface DescriptionFormProps {
  initialData: {
    description: string | null;
  };
  courseId: string;
}

const formSchema = z.object({
  description: z
    .string()
    .min(1, { message: "Description is required" })
    .max(500, { message: "Description cannot exceed 500 characters" }), // Added max length validation
});

export const DescriptionForm = ({ initialData, courseId }: DescriptionFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const toggleEdit = () => setIsEditing((current) => !current);

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
      // API call to update the course description
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Description updated successfully");
      toggleEdit();
      router.refresh();
    } catch (error) {
      console.error("Error updating description:", error);
      toast.error("Something went wrong while updating the description");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Description
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? "Cancel" : (
            <>
              <Pencil className="w-4 h-4" />
              Edit
            </>
          )}
        </Button>
      </div>

      {/* Display description or a fallback message */}
      {!isEditing && (
        <p className={cn("text-sm mt-2", !initialData.description && "text-slate-500 italic")}>
          {initialData.description || "No description available for this course."}
        </p>
      )}

      {/* Edit form for description */}
      {isEditing && (
        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      disabled={isSubmitting}
                      placeholder="e.g., 'Learn advanced web development concepts...'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </FormProvider>
      )}
    </div>
  );
};
