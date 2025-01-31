import { NextResponse } from "next/server";
import { voteForShow } from "@/app/actions";

export async function POST(req: Request) {
  try {
    const { show, category } = await req.json();
    await voteForShow(show, category);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to vote" }, { status: 500 });
  }
}
