import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import User from "@/lib/db/models/User";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email, plan } = await req.json();

    if (!email || !plan) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const user = await User.findOneAndUpdate(
      { email },
      { currentPlan: plan },
      { new: true }
    );

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "Failed to save plan" }, { status: 500 });
  }
}
