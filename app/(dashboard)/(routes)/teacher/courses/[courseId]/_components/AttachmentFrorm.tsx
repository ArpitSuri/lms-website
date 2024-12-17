"use client";

import * as z from "zod";
import { Button } from "@/components/ui/button";
import { File, ImageIcon, Loader2, Pencil, PlusCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import Image from "next/image";
import { FileUpload } from "@/components/file-upload";
import { Attachment, Course } from "@prisma/client";
import axios from "axios";

interface AttachmentFormProps {
  initialData: Course & { attachments: Attachment[] };
  courseId: string;
}

const formSchema = z.object({
  url: z.string().min(1, { message: "Image is required" }),
});

export const AttachmentForm = ({ initialData, courseId }: AttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false); // Add state for deletion process
  const [isUploading, setIsUploading] = useState(false); // Add state for upload process
  const router = useRouter();

  const toggleEdit = () => setIsEditing((current) => !current);

  const formMethods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: initialData?.imageUrl || "", // Ensure default value is a string
    },
  });

  const { handleSubmit } = formMethods;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsUploading(true); // Set uploading state to true
      await axios.post(`/api/courses/${courseId}/attachments`, values);
      toast.success("Attachment updated successfully!");
      toggleEdit();
      router.refresh();
    } catch (error) {
      console.error("Error updating image:", error);
      toast.error("Something went wrong while updating the image.");
    } finally {
      setIsUploading(false); // Set uploading state back to false
    }
  };

  const onDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      setDeletingId(id);
      await axios.delete(`/api/courses/${courseId}/attachment/${id}`);
      toast.success("Attachment deleted");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong while deleting the attachment");
      console.log(" deleting the attachment" , error);
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Attachment
        <Button onClick={toggleEdit} variant="ghost" disabled={isUploading}>
          {isEditing ? "Cancel" : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a File
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <>
          {initialData.attachments.length === 0 ? (
            <div className="text-sm mt-2 text-slate-500 italic">
              No attachments yet. Click "Add a File" to upload one.
            </div>
          ) : (
            <div className="space-y-2">
              {initialData.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                >
                  <File className="h-4 w-4 mr-2 flex-shrink-0" />
                  <p className="text-xs line-clamp-1">{attachment.name}</p>
                  {deletingId === attachment.id ? (
                    <div>
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  ) : (
                    <button
                      onClick={() => onDelete(attachment.id)}
                      disabled={isDeleting || isUploading}
                      className="ml-auto hover:opacity-75 transition"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url) => onSubmit({ url })}
          />
        </div>
      )}
    </div>
  );
};
