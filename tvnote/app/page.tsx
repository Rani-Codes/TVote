"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { getLeaderboard } from "@/app/actions";

export default function Home() {
  const { user } = useUser();
  const [show, setShow] = useState<string>("");
  const [desertIsland, setDesertIsland] = useState<[string, number][]>([]);
  const [eatingShows, setEatingShows] = useState<[string, number][]>([]);

  useEffect(() => {
    getLeaderboard().then(({ desertIsland, eatingShows }) => {
      setDesertIsland(desertIsland);
      setEatingShows(eatingShows);
    });
  }, []);

  const vote = async (category: "desert_island" | "watch_while_eating") => {
    await fetch("/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ show, category }),
    });

    // Refresh leaderboard after voting
    getLeaderboard().then(({ desertIsland, eatingShows }) => {
      setDesertIsland(desertIsland);
      setEatingShows(eatingShows);
    });
  };

  return (
    <div>
      {user ? (
        <>
          <input 
            value={show} 
            onChange={(e) => setShow(e.target.value)} 
            placeholder="Enter a show" 
          />
          <button onClick={() => vote("desert_island")}>Vote as Desert Island Show</button>
          <button onClick={() => vote("watch_while_eating")}>Vote as Eating Show</button>
        </>
      ) : (
        <p>Please sign in to vote</p>
      )}

      <h2>Desert Island Shows</h2>
      <ul>
        {desertIsland.map(([name, votes]) => (
          <li key={name}>{name} - {votes} votes</li>
        ))}
      </ul>

      <h2>Watch While Eating Shows</h2>
      <ul>
        {eatingShows.map(([name, votes]) => (
          <li key={name}>{name} - {votes} votes</li>
        ))}
      </ul>
    </div>
  );
}
