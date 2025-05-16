
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LeaderboardEntry {
  id: number;
  username: string;
  avatar: string;
  rank: number;
  wins: number;
  losses: number;
  stages_completed: number;
  achievement_count: number;
  last_active: string;
}

const mockLeaderboardData: LeaderboardEntry[] = [
  {
    id: 1,
    username: "MindMaster",
    avatar: "mindmaster",
    rank: 1,
    wins: 124,
    losses: 16,
    stages_completed: 15,
    achievement_count: 12,
    last_active: "Today"
  },
  {
    id: 2,
    username: "Psychokiller",
    avatar: "psychokiller",
    rank: 2,
    wins: 118,
    losses: 22,
    stages_completed: 15,
    achievement_count: 11,
    last_active: "Yesterday"
  },
  {
    id: 3,
    username: "GrandmaSlayer",
    avatar: "grandmaslayer",
    rank: 3,
    wins: 103,
    losses: 19,
    stages_completed: 15,
    achievement_count: 10,
    last_active: "2 days ago"
  },
  {
    id: 4,
    username: "TricksterNemesis",
    avatar: "tricksternemesis",
    rank: 4,
    wins: 98,
    losses: 34,
    stages_completed: 14,
    achievement_count: 9,
    last_active: "1 week ago"
  },
  {
    id: 5,
    username: "DoorWhisperer",
    avatar: "doorwhisperer",
    rank: 5,
    wins: 91,
    losses: 27,
    stages_completed: 15,
    achievement_count: 8,
    last_active: "3 days ago"
  },
  {
    id: 6,
    username: "MindBreaker",
    avatar: "mindbreaker",
    rank: 6,
    wins: 87,
    losses: 42,
    stages_completed: 14,
    achievement_count: 7,
    last_active: "Today"
  },
  {
    id: 7,
    username: "IllusionMaster",
    avatar: "illusionmaster",
    rank: 7,
    wins: 82,
    losses: 39,
    stages_completed: 13,
    achievement_count: 8,
    last_active: "2 days ago"
  },
  {
    id: 8,
    username: "PsychoHunter",
    avatar: "psychohunter",
    rank: 8,
    wins: 76,
    losses: 41,
    stages_completed: 12,
    achievement_count: 6,
    last_active: "Today"
  },
  {
    id: 9,
    username: "DeceptionKing",
    avatar: "deceptionking",
    rank: 9,
    wins: 71,
    losses: 43,
    stages_completed: 12,
    achievement_count: 5,
    last_active: "Yesterday"
  },
  {
    id: 10,
    username: "MindReader",
    avatar: "mindreader",
    rank: 10,
    wins: 68,
    losses: 39,
    stages_completed: 11,
    achievement_count: 7,
    last_active: "4 days ago"
  },
];

// For the mock data, just use the current user's email to place them in the rankings
const addCurrentUser = () => {
  const email = localStorage.getItem("user_email");
  if (!email) return mockLeaderboardData;
  
  const username = localStorage.getItem("username") || email.split("@")[0];
  const myEntry = {
    id: 42,
    username,
    avatar: email,
    rank: 42,
    wins: 12,
    losses: 8,
    stages_completed: 5,
    achievement_count: 2,
    last_active: "Today"
  };
  
  return [...mockLeaderboardData, myEntry];
};

const Leaderboard = () => {
  const [leaderboardData] = useState<LeaderboardEntry[]>(addCurrentUser());
  const [filterType, setFilterType] = useState<"all" | "weekly" | "monthly">("all");
  
  const currentUserEmail = localStorage.getItem("user_email");
  
  const getFilteredData = () => {
    // In a real app, this would filter based on time periods
    return leaderboardData;
  };
  
  const data = getFilteredData();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-950 text-white p-4 md:p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
          <span className="text-purple-400">Door</span> of <span className="text-purple-400">Illusions</span> Leaderboard
        </h1>
        
        <Tabs defaultValue="all" onValueChange={(v) => setFilterType(v as "all" | "weekly" | "monthly")}>
          <div className="flex justify-center mb-6">
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="all">All Time</TabsTrigger>
              <TabsTrigger value="weekly">This Week</TabsTrigger>
              <TabsTrigger value="monthly">This Month</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all">
            <LeaderboardTable data={data} currentUserEmail={currentUserEmail} />
          </TabsContent>
          
          <TabsContent value="weekly">
            <LeaderboardTable data={data} currentUserEmail={currentUserEmail} />
          </TabsContent>
          
          <TabsContent value="monthly">
            <LeaderboardTable data={data} currentUserEmail={currentUserEmail} />
          </TabsContent>
        </Tabs>
        
        <div className="mt-12 max-w-2xl mx-auto">
          <Card className="bg-black/80 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-center text-xl">Leaderboard Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                  <div className="text-xl font-bold text-yellow-400">1st Place</div>
                  <p className="mt-2 text-sm">Exclusive "Mindmaster" badge + 500 token reward</p>
                </div>
                <div className="bg-gray-700/20 border border-gray-400/30 rounded-lg p-4">
                  <div className="text-xl font-bold text-gray-400">2nd Place</div>
                  <p className="mt-2 text-sm">Exclusive "Psychic" badge + 250 token reward</p>
                </div>
                <div className="bg-amber-900/20 border border-amber-600/30 rounded-lg p-4">
                  <div className="text-xl font-bold text-amber-600">3rd Place</div>
                  <p className="mt-2 text-sm">Exclusive "Trickster" badge + 100 token reward</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const LeaderboardTable = ({ 
  data, 
  currentUserEmail 
}: { 
  data: LeaderboardEntry[], 
  currentUserEmail: string | null 
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-purple-900/30 border-b border-purple-500/30">
            <th className="py-3 px-4 text-left">Rank</th>
            <th className="py-3 px-4 text-left">Player</th>
            <th className="py-3 px-4 text-center">Wins</th>
            <th className="py-3 px-4 text-center hidden md:table-cell">Stages</th>
            <th className="py-3 px-4 text-center hidden md:table-cell">Win %</th>
            <th className="py-3 px-4 text-center hidden md:table-cell">Achievements</th>
            <th className="py-3 px-4 text-center hidden md:table-cell">Last Active</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry) => {
            const isCurrentUser = currentUserEmail && entry.avatar === currentUserEmail;
            const winRate = Math.round((entry.wins / (entry.wins + entry.losses)) * 100);
            
            return (
              <tr 
                key={entry.id} 
                className={`border-b border-purple-900/30 hover:bg-purple-900/10 ${isCurrentUser ? 'bg-purple-900/20' : ''}`}
              >
                <td className="py-3 px-4">
                  {entry.rank <= 3 ? (
                    <Badge className={`
                      ${entry.rank === 1 ? 'bg-yellow-600' : ''}
                      ${entry.rank === 2 ? 'bg-gray-400' : ''}
                      ${entry.rank === 3 ? 'bg-amber-700' : ''}
                    `}>
                      #{entry.rank}
                    </Badge>
                  ) : (
                    <span>#{entry.rank}</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`https://api.dicebear.com/7.x/personas/svg?seed=${entry.avatar}`} alt={entry.username} />
                      <AvatarFallback>{entry.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{entry.username}</div>
                      {isCurrentUser && <span className="text-xs text-purple-400">(You)</span>}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-center font-semibold">{entry.wins}</td>
                <td className="py-3 px-4 text-center hidden md:table-cell">{entry.stages_completed}/15</td>
                <td className="py-3 px-4 text-center hidden md:table-cell">{winRate}%</td>
                <td className="py-3 px-4 text-center hidden md:table-cell">{entry.achievement_count}</td>
                <td className="py-3 px-4 text-center hidden md:table-cell text-gray-400 text-sm">{entry.last_active}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
