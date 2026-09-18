import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db";
import { waitlist } from "@/db/schema";

const signupSchema = z.object({ email: z.string().trim().email().max(254) });

export async function POST(request: Request) {
  try {
    const parsed = signupSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ message: "Enter a valid email address." }, { status: 400 });
    }
    const email = parsed.data.email.toLowerCase();
    const inserted = await getDb()
      .insert(waitlist)
      .values({ email })
      .onConflictDoNothing({ target: waitlist.email })
      .returning({ id: waitlist.id });

    return NextResponse.json({
      message: inserted.length
        ? "You're on the list. We'll keep you posted."
        : "You're already on the list—we've got you.",
    });
  } catch (error) {
    console.error("waitlist signup failed", error);
    return NextResponse.json(
      { message: "We couldn't save that right now. Please try again." },
      { status: 503 },
    );
  }
}
