"use server";

import { redis } from "@/app/utils/redis";

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

export async function voteForShow(show: string, category: "desert_island" | "watch_while_eating") {
  if (!show.trim()) return;

  // Increment the score for the show in the selected category
  await redis.zincrby(`leaderboard:${category}`, 1, show);
}

