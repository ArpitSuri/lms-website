import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { IconBadge } from "@/components/icon-badge";
import { CircleDollarSign, LayoutDashboard, ListCheck, File } from "lucide-react";
import TitleForm from "./_components/TitleForm";
import { DescriptionForm } from "./_components/DescriptionForm";
import { ImageUpload } from "./_components/Imageupload";
import { CategoryForm } from "./_components/CategoryForm";
import { PriceForm } from "./_components/PriceForm";
import { AttachmentForm } from "./_components/AttachmentFrorm";
import { ChapterForm } from "./_components/ChapterFrom";
import { boolean } from "zod";
import { Banner } from "@/components/banner";
import { CourseActions } from "./_components/CourseActions";

const CoursecreationPage = async ({ params }: { params: { courseId: string } }) => {
    // Ensure params is awaited before using
    const { courseId } = await params;

    console.log("Course ID:", courseId);

    // Authenticate the user
    const { userId } = await auth();
    if (!userId) {
        console.warn("User not authenticated. Redirecting to home page.");
        return redirect("/");
    }

    // Fetch course details
    const course = await db.course.findUnique({
        where: {
            id: courseId,
            userId,
        },
        include: {
            chapters: {
                orderBy: {
                    position: "asc"
                },
            },
            attachments: {
                orderBy: {
                    createdAt: "desc",
                },
            },
        },
    });

    // Fetch categories
    const categories = await db.category.findMany({
        orderBy: { name: "asc" },
    });

    if (!course) {
        console.warn("Course not found or user does not have access. Redirecting.");
        return redirect("/");
    }

    // Calculate field completion
    const requiredFields = [
        course.title,
        course.description,
        course.imageUrl,
        course.price,
        course.categoryId,
        course.chapters.some(chapter => chapter.isPublished)
    ];
    const totalField = requiredFields.length;
    const completeFields = requiredFields.filter(Boolean).length;
    const completionFields = `(${completeFields}/${totalField})`;
    const isComplete = requiredFields.every(Boolean);

    return (<>
    {!course.isPublished &&(
        <Banner 
        label="This Course iis unpublished . It will not  visible to students"
        />
    )}
        <div className="p-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-y-2">
                    <h1 className="text-2xl font-medium">Course Setup</h1>
                    <span className="text-sm text-slate-700">
                        Complete all fields {completionFields}
                    </span>
                </div>
                <CourseActions 
                disabled={!isComplete}
                courseId={params.courseId}
                isPublished={course.isPublished} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                <div>
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={LayoutDashboard} />
                        <h2 className="text-xl">Customize Your Course</h2>
                    </div>
                    {/* Render Title Form */}
                    <TitleForm initialData={course} courseId={course.id} />
                    {/* Render Description Form */}
                    <DescriptionForm initialData={course} courseId={course.id} />

                    {/* Render Image Upload */}
                    <ImageUpload initialData={course} courseId={course.id} />

                    <CategoryForm
                        initialData={course} courseId={course.id}
                        options={categories.map((category) => ({
                            label: category.name,
                            value: category.id,
                        }))}
                    />
                </div>
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={ListCheck} />
                            <h2 className="text-xl">
                                Course Chapters
                            </h2>
                        </div>
                        <div>
                            <ChapterForm initialData={course} courseId={course.id} />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={CircleDollarSign} />
                            <h2 className="text-xl"> Sell Your Course</h2>
                        </div>
                        <PriceForm initialData={course} courseId={course.id} />
                    </div>
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={File} />
                            <h2 className="text-xl"> Resources & Attachments</h2>
                        </div>
                        <AttachmentForm initialData={course} courseId={course.id} />
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default CoursecreationPage;
