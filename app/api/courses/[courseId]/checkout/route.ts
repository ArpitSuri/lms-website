import { db } from "@/lib/db";
import Stripe from "stripe";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request, { params }: { params: { courseId: string } }) {
  try {
    const user = await currentUser();

    if (!user || !user.id || !user?.emailAddresses?.[0]?.emailAddress) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: { id: params.courseId },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        isPublished: true,
      },
    });

    if (!course || !course.isPublished) {
      return new NextResponse("Course not found", { status: 404 });
    }

    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: params.courseId,
        },
      },
    });

    if (purchase) {
      return new NextResponse("Already Purchased", { status: 400 });
    }

    if (!course.price) {
      return new NextResponse("Course price is missing", { status: 400 });
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        quantity: 1,
        price_data: {
          currency: "INR",
          product_data: {
            name: course.title,
            description: course.description || "No description available",
          },
          unit_amount: Math.round(course.price * 100),
        },
      },
    ];

    let stripeCustomer = await db.stripeCustomer.findUnique({
      where: { userId: user.id },
      select: { stripeCustomerId: true },
    });

    if (!stripeCustomer) {
      const customer = await stripe.customers.create({
        email: user?.emailAddresses?.[0]?.emailAddress,
      });
      stripeCustomer = await db.stripeCustomer.create({
        data: {
          stripeCustomerId: customer.id,
          userId: user.id,
        },
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomer.stripeCustomerId,
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?cancel=1`,
      metadata: {
        courseId: course.id,
        userId: user.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error in Course Id Checkout:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
