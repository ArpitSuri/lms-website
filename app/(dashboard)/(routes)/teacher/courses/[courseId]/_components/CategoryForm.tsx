"use client";

import * as z from "zod";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { Course } from "@prisma/client";
import { Combobox } from "@/components/ui/combobox";

interface CategoryFormProps {
  initialData: Course;
  courseId: string;
  options: { label: string; value: string }[];
}

const formSchema = z.object({
  categoryId: z.string().min(1),
});

export const CategoryForm = ({ initialData, courseId, options }: CategoryFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const toggleEdit = () => setIsEditing((current) => !current);

  const formMethods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: initialData?.categoryId || "", // Ensure default value is a string
    },
  });

  const { handleSubmit, control, formState } = formMethods;
  const { isSubmitting, isValid } = formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // API call to update the course description
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Category updated successfully");
      toggleEdit();
      router.refresh();
    } catch (error) {
      console.error("Error updating description:", error);
      toast.error("Something went wrong while updating the description");
    }
  };

  const selectedOption = options.find((option) => option.value === initialData.categoryId);

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Category
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? "Cancel" : (
            <>
              <Pencil className="w-4 h-4" />
              Edit Category
            </>
          )}
        </Button>
      </div>

      {/* Display category or fallback message */}
      {!isEditing && (
        <p className={cn("text-sm mt-2", !initialData.categoryId && "text-slate-500 italic")}>
          {selectedOption?.label || "No Category available for this course."}
        </p>
      )}

      {isEditing && (
        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox
                      value={field.value} // Bind value to form state
                      onChange={(value) => field.onChange(value)} // Bind onChange to react-hook-form
                      options={options} // Pass options to Combobox
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
