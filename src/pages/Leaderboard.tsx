
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Star, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const Leaderboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock leaderboard data
  const leaderboardData = {
    allTime: [
      { rank: 1, username: "MindMaster", score: 15380, highestStage: 15, winRate: 72, badges: 8, avatar: "" },
      { rank: 2, username: "PsychoPlayer", score: 14250, highestStage: 14, winRate: 68, badges: 7, avatar: "" },
      { rank: 3, username: "Illusionist", score: 13120, highestStage: 13, winRate: 65, badges: 6, avatar: "" },
      { rank: 4, username: "DoorChooser", score: 12540, highestStage: 12, winRate: 63, badges: 6, avatar: "" },
      { rank: 5, username: "GrannyWhisperer", score: 11980, highestStage: 13, winRate: 60, badges: 5, avatar: "" },
      { rank: 6, username: "TrustNoOne", score: 10870, highestStage: 11, winRate: 58, badges: 5, avatar: "" },
      { rank: 7, username: "Player123", score: 9540, highestStage: 10, winRate: 55, badges: 4, avatar: "" },
      { rank: 8, username: "DoorHunter", score: 8920, highestStage: 9, winRate: 52, badges: 4, avatar: "" },
      { rank: 9, username: "MindReader", score: 8120, highestStage: 9, winRate: 50, badges: 3, avatar: "" },
      { rank: 10, username: "PsychExpert", score: 7840, highestStage: 8, winRate: 48, badges: 3, avatar: "" }
    ],
    monthly: [
      { rank: 1, username: "PsychoPlayer", score: 5250, highestStage: 14, winRate: 70, badges: 3, avatar: "" },
      { rank: 2, username: "MindMaster", score: 4980, highestStage: 12, winRate: 65, badges: 2, avatar: "" },
      { rank: 3, username: "Player123", score: 4540, highestStage: 10, winRate: 60, badges: 2, avatar: "" }
      // ... more players
    ],
    weekly: [
      { rank: 1, username: "Player123", score: 2340, highestStage: 8, winRate: 75, badges: 1, avatar: "" },
      { rank: 2, username: "DoorHunter", score: 2120, highestStage: 7, winRate: 70, badges: 1, avatar: "" },
      { rank: 3, username: "MindMaster", score: 1980, highestStage: 7, winRate: 65, badges: 1, avatar: "" }
      // ... more players
    ]
  };
  
  const filterPlayers = (players, term) => {
    if (!term) return players;
    return players.filter(player => 
      player.username.toLowerCase().includes(term.toLowerCase())
    );
  };

  // Generate rank styling based on position
  const getRankStyle = (rank) => {
    switch(rank) {
      case 1:
        return "bg-yellow-500 text-black font-bold";
      case 2:
        return "bg-gray-300 text-black font-bold";
      case 3:
        return "bg-amber-700 text-white font-bold";
      default:
        return "bg-purple-900/30 text-white";
    }
  };

  const renderTable = (players) => {
    const filteredPlayers = filterPlayers(players, searchTerm);
    
    return (
      <Table>
        <TableHeader>
          <TableRow className="border-purple-500/30">
            <TableHead className="text-purple-300 w-16">Rank</TableHead>
            <TableHead className="text-purple-300">Player</TableHead>
            <TableHead className="text-purple-300 text-right">Score</TableHead>
            <TableHead className="text-purple-300 text-center hidden sm:table-cell">Stage</TableHead>
            <TableHead className="text-purple-300 text-center hidden sm:table-cell">Win Rate</TableHead>
            <TableHead className="text-purple-300 text-center hidden md:table-cell">Badges</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPlayers.map((player) => (
            <TableRow 
              key={player.rank} 
              className={player.username === "Player123" ? "border-purple-500/30 bg-purple-900/20" : "border-purple-500/10"}
            >
              <TableCell className="font-medium">
                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${getRankStyle(player.rank)}`}>
                  {player.rank}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={player.avatar} alt={player.username} />
                    <AvatarFallback className="bg-purple-700 text-xs">
                      {player.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className={player.username === "Player123" ? "font-semibold text-purple-300" : ""}>
                    {player.username}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right font-semibold">{player.score.toLocaleString()}</TableCell>
              <TableCell className="text-center hidden sm:table-cell">{player.highestStage}</TableCell>
              <TableCell className="text-center hidden sm:table-cell">{player.winRate}%</TableCell>
              <TableCell className="text-center hidden md:table-cell">
                <div className="flex items-center justify-center gap-1">
                  <Badge variant="outline" className="bg-purple-900/30 text-purple-300 border-purple-500/30">
                    {player.badges}
                  </Badge>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-950 text-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">Leaderboard</h1>
        
        <div className="mb-8 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            type="text" 
            placeholder="Search players..." 
            className="pl-10 bg-purple-900/20 border-purple-500/30 text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Card className="bg-purple-900/20 border-purple-500/30 text-white">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="text-purple-400 mr-2" />
              Top Players
            </CardTitle>
            <CardDescription className="text-gray-300">
              See who's mastering the game of deception
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all-time" className="w-full">
              <TabsList className="bg-purple-900/30 border-purple-500/30 mb-6 grid grid-cols-3">
                <TabsTrigger value="all-time" className="data-[state=active]:bg-purple-700">All Time</TabsTrigger>
                <TabsTrigger value="monthly" className="data-[state=active]:bg-purple-700">Monthly</TabsTrigger>
                <TabsTrigger value="weekly" className="data-[state=active]:bg-purple-700">Weekly</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all-time">
                {renderTable(leaderboardData.allTime)}
              </TabsContent>
              
              <TabsContent value="monthly">
                {renderTable(leaderboardData.monthly)}
              </TabsContent>
              
              <TabsContent value="weekly">
                {renderTable(leaderboardData.weekly)}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Leaderboard;
