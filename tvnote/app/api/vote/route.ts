import { hasVotedForCategory, voteForShow } from '@/app/actions';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    return redirectToSignIn(); // Redirects to the sign-in page if the user is not authenticated
  }

  try {
    const { show, category } = await req.json();
  
    // Check if the user has already voted for this category
    const alreadyVoted = await hasVotedForCategory(userId, show, category);
    if (alreadyVoted) {
      return NextResponse.json(
        { error: `You have already voted for the ${category} category.` },
        { status: 400 }
      );
    }
  
    // Allow voting for the selected category
    await voteForShow(show, category, userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);  // Add this line to print the error in the console
    return NextResponse.json({ error: "Failed to vote" }, { status: 500 });
  }  
}
