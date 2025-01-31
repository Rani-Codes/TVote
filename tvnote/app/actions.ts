"use server";

import { redis } from "@/app/utils/redis";

// This function checks if the user has already voted for a specific show in the selected category
export async function hasVotedForCategory(userId: string, show: string, category: string) {
  // The Redis key for storing the user's vote for the show in the selected category
  const userVoteKey = `user:${userId}:votes:${category}`;

  // Check if the user has voted for this show in the selected category
  const hasVoted = await redis.sismember(userVoteKey, show);
  return hasVoted; // Returns true if the user has already voted
}

export async function getLeaderboard() {
  const desertIslandRaw: string[] = await redis.zrange("leaderboard:desert_island", 0, 9, { rev: true, withScores: true });
  const eatingShowsRaw: string[] = await redis.zrange("leaderboard:watch_while_eating", 0, 9, { rev: true, withScores: true });

  // Transform the raw data into an array of tuples
  const desertIsland: [string, number][] = [];
  for (let i = 0; i < desertIslandRaw.length; i += 2) {
    desertIsland.push([desertIslandRaw[i], parseInt(desertIslandRaw[i + 1], 10)]);
  }

  const eatingShows: [string, number][] = [];
  for (let i = 0; i < eatingShowsRaw.length; i += 2) {
    eatingShows.push([eatingShowsRaw[i], parseInt(eatingShowsRaw[i + 1], 10)]);
  }

  return { desertIsland, eatingShows };
}

export async function voteForShow(show: string, category: "desert_island" | "watch_while_eating", clerkSession: string) {
  if (!show.trim()) return;

  // Get user ID from Clerk session
  const userId = clerkSession;

  // Check if the user has already voted for this show in the selected category
  const userVoteKey = `user:${userId}:votes:${category}`;

  // Check if the user has voted for this show
  const hasVoted = await redis.sismember(userVoteKey, show);

  if (hasVoted) {
    // If the user has already voted, return early
    return;
  }

  // Increment the score for the show in the selected category
  await redis.zincrby(`leaderboard:${category}`, 1, show);

  // Mark that the user has voted for this show by adding it to the user's vote set
  await redis.sadd(userVoteKey, show);
}
