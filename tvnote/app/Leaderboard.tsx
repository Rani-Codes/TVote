import type React from "react"
import { Trophy, Medal, Award, User } from "lucide-react"

interface LeaderboardProps {
  desertIsland: [string, number][]
  eatingShows: [string, number][]
}

export default function Leaderboard({
  desertIsland,
  eatingShows,
}: LeaderboardProps) {
  return (
    <div className="w-full max-w-4xl p-4 border rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4">Leaderboard</h2>
      <div className="flex w-full h-full justify-center mt-8">
        <div className="w-1/2 pr-8">
          <h2 className="text-xl font-bold mb-2 underline text-center">Desert Island Shows</h2>
          <ul>
            {desertIsland.map(([name, votes]) => (
              <li key={name} className="mb-2 text-center">
                {name} - {votes} votes
              </li>
            ))}
          </ul>
        </div>

        <div className="w-1/2 pl-8">
          <h2 className="text-xl font-bold mb-2 underline text-center">Watch While Eating Shows</h2>
          <ul>
            {eatingShows.map(([name, votes]) => (
              <li key={name} className="mb-2 text-center">
                {name} - {votes} votes
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
