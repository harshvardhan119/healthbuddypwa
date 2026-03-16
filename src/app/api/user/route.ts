import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import User from "@/lib/db/models/User";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email, profile } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await User.findOneAndUpdate(
      { email },
      { profile, createdAt: new Date() },
      { upsert: true, new: true }
    );

    return NextResponse.json(user);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    return NextResponse.json(user || { error: "User not found" });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
