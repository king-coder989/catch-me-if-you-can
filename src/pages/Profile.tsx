
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Award, Star, User, Settings } from "lucide-react";

const Profile = () => {
  // Mock user data - this would come from your authentication system
  const [userData, setUserData] = useState({
    username: "Player123",
    email: "player@example.com",
    joinedDate: "January 2024",
    avatarUrl: "",
    level: 5,
    xp: 1250,
    xpToNextLevel: 2000,
    gamesPlayed: 42,
    gamesWon: 18,
    highestStage: 8,
    achievements: [
      { id: 1, name: "First Win", description: "Win your first game", earned: true, date: "Feb 15, 2024" },
      { id: 2, name: "Psychologist", description: "Reach stage 5 with doubt meter above 70%", earned: true, date: "Mar 2, 2024" },
      { id: 3, name: "Deception Master", description: "Reach stage 10", earned: false },
      { id: 4, name: "Mind Games", description: "Win 3 games in a row", earned: false },
      { id: 5, name: "Doubt No More", description: "Win with 100% doubt", earned: false }
    ],
    badges: [
      { id: 1, name: "Bronze Player", icon: "trophy", color: "bronze" },
      { id: 2, name: "Mind Reader", icon: "brain", color: "silver" }
    ],
    recentGames: [
      { id: 1, result: "Win", stage: 5, date: "Apr 3, 2024" },
      { id: 2, result: "Loss", stage: 3, date: "Apr 2, 2024" },
      { id: 3, result: "Win", stage: 4, date: "Apr 1, 2024" }
    ]
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-950 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile sidebar */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            <Card className="bg-purple-900/20 border-purple-500/30 text-white">
              <CardHeader className="text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src={userData.avatarUrl} alt={userData.username} />
                  <AvatarFallback className="bg-purple-700 text-white text-2xl">
                    {userData.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-2xl text-purple-300">{userData.username}</CardTitle>
                <CardDescription className="text-gray-300">Joined {userData.joinedDate}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-sm text-gray-300 mb-1">Level {userData.level}</p>
                  <div className="w-full bg-gray-700 h-2 rounded-full">
                    <div 
                      className="bg-purple-500 h-full rounded-full" 
                      style={{ width: `${(userData.xp / userData.xpToNextLevel) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{userData.xp} / {userData.xpToNextLevel} XP</p>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                  <div className="bg-purple-800/30 p-2 rounded">
                    <p className="font-bold text-lg">{userData.gamesPlayed}</p>
                    <p className="text-gray-300">Games</p>
                  </div>
                  <div className="bg-purple-800/30 p-2 rounded">
                    <p className="font-bold text-lg">{userData.gamesWon}</p>
                    <p className="text-gray-300">Wins</p>
                  </div>
                  <div className="bg-purple-800/30 p-2 rounded">
                    <p className="font-bold text-lg">{userData.highestStage}</p>
                    <p className="text-gray-300">Best</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            <Tabs defaultValue="stats" className="w-full">
              <TabsList className="bg-purple-900/20 border-purple-500/30 mb-6">
                <TabsTrigger value="stats" className="data-[state=active]:bg-purple-700">Stats</TabsTrigger>
                <TabsTrigger value="achievements" className="data-[state=active]:bg-purple-700">Achievements</TabsTrigger>
                <TabsTrigger value="badges" className="data-[state=active]:bg-purple-700">Badges</TabsTrigger>
                <TabsTrigger value="history" className="data-[state=active]:bg-purple-700">Game History</TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:bg-purple-700">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="stats">
                <Card className="bg-purple-900/20 border-purple-500/30 text-white">
                  <CardHeader>
                    <CardTitle>Player Statistics</CardTitle>
                    <CardDescription className="text-gray-300">Your game performance</CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-purple-300">Game Stats</h3>
                      <ul className="space-y-2">
                        <li className="flex justify-between">
                          <span>Games Played</span>
                          <span className="font-medium">{userData.gamesPlayed}</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Win Rate</span>
                          <span className="font-medium">{Math.round((userData.gamesWon / userData.gamesPlayed) * 100)}%</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Highest Stage</span>
                          <span className="font-medium">{userData.highestStage}</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-purple-300">Performance</h3>
                      <ul className="space-y-2">
                        <li className="flex justify-between">
                          <span>Times Peeked</span>
                          <span className="font-medium">14</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Times Begged</span>
                          <span className="font-medium">7</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Average Doubt Level</span>
                          <span className="font-medium">62%</span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="achievements">
                <Card className="bg-purple-900/20 border-purple-500/30 text-white">
                  <CardHeader>
                    <CardTitle>Achievements</CardTitle>
                    <CardDescription className="text-gray-300">Your game accomplishments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {userData.achievements.map(achievement => (
                        <div 
                          key={achievement.id} 
                          className={`p-4 rounded-lg border ${achievement.earned ? 'border-purple-500/50 bg-purple-900/30' : 'border-gray-700/50 bg-gray-900/20 opacity-60'}`}
                        >
                          <div className="flex items-start">
                            <div className={`mr-3 ${achievement.earned ? 'text-purple-400' : 'text-gray-500'}`}>
                              {achievement.earned ? <Trophy size={24} /> : <Trophy size={24} />}
                            </div>
                            <div>
                              <h4 className="font-semibold">{achievement.name}</h4>
                              <p className="text-sm text-gray-400">{achievement.description}</p>
                              {achievement.earned && (
                                <p className="text-xs text-purple-400 mt-1">Earned on {achievement.date}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="badges">
                <Card className="bg-purple-900/20 border-purple-500/30 text-white">
                  <CardHeader>
                    <CardTitle>Badges</CardTitle>
                    <CardDescription className="text-gray-300">Display these on your profile</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {userData.badges.map(badge => (
                        <div key={badge.id} className="flex flex-col items-center p-4 bg-purple-900/30 rounded-lg border border-purple-500/50">
                          <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-700 to-pink-600 mb-3">
                            {badge.icon === 'trophy' ? <Trophy size={32} /> : <Award size={32} />}
                          </div>
                          <h4 className="font-semibold text-center">{badge.name}</h4>
                          <Badge variant="outline" className="mt-2 border-purple-500/50">
                            {badge.color === 'bronze' ? 'Bronze' : badge.color === 'silver' ? 'Silver' : 'Gold'}
                          </Badge>
                        </div>
                      ))}
                      
                      {/* Locked badge */}
                      <div className="flex flex-col items-center p-4 bg-gray-900/20 rounded-lg border border-gray-700/50 opacity-60">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gray-800 mb-3">
                          <Star size={32} className="text-gray-600" />
                        </div>
                        <h4 className="font-semibold text-center">???</h4>
                        <p className="text-xs text-gray-500 mt-1">Locked</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="history">
                <Card className="bg-purple-900/20 border-purple-500/30 text-white">
                  <CardHeader>
                    <CardTitle>Game History</CardTitle>
                    <CardDescription className="text-gray-300">Your recent games</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {userData.recentGames.map(game => (
                        <div 
                          key={game.id} 
                          className={`p-4 rounded-lg border ${game.result === 'Win' ? 'border-green-500/30 bg-green-900/10' : 'border-red-500/30 bg-red-900/10'}`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <span className={`font-semibold ${game.result === 'Win' ? 'text-green-400' : 'text-red-400'}`}>
                                {game.result}
                              </span>
                              <span className="text-gray-400 ml-2">Stage {game.stage}</span>
                            </div>
                            <span className="text-sm text-gray-400">{game.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="settings">
                <Card className="bg-purple-900/20 border-purple-500/30 text-white">
                  <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription className="text-gray-300">Manage your account</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-3 text-purple-300">Account Information</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Username</span>
                            <span className="font-medium">{userData.username}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Email</span>
                            <span className="font-medium">{userData.email}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-3 text-purple-300">Preferences</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span>Sound Effects</span>
                            <div className="w-10 h-6 bg-purple-600 rounded-full relative">
                              <div className="w-4 h-4 rounded-full bg-white absolute right-1 top-1"></div>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Voice Audio</span>
                            <div className="w-10 h-6 bg-purple-600 rounded-full relative">
                              <div className="w-4 h-4 rounded-full bg-white absolute right-1 top-1"></div>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Public Profile</span>
                            <div className="w-10 h-6 bg-gray-700 rounded-full relative">
                              <div className="w-4 h-4 rounded-full bg-white absolute left-1 top-1"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
