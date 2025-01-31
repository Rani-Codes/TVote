"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { getLeaderboard } from "@/app/actions";
import Leaderboard from "./Leaderboard";

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
    <div className="">
      {user ? (
        <>
        <div className="flex flex-col justify-center items-center text-2xl font-semibold">
            <input 
                value={show} 
                onChange={(e) => setShow(e.target.value)} 
                placeholder="Enter a show" 
                className=" text-center font-normal"
            />
            <div className="flex justify-center gap-20 w-full">
                <button onClick={() => vote("desert_island")}>Vote as Desert Island Show</button>
                <button onClick={() => vote("watch_while_eating")}>Vote as Eating Show</button>
            </div>
        </div>

        </>
      ) : (
        <p className="text-3xl">Please sign in to vote</p>
      )}

        <div className="flex w-full h-full justify-center">
        <Leaderboard
        desertIsland={desertIsland}
        eatingShows={eatingShows}
        />
        </div>
    </div>
  );
}
