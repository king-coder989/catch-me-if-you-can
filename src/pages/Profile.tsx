import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface UserProfile {
  email: string;
  gender?: string;
  age?: number;
  walletAddress?: string;
  username?: string;
  displayName?: string;
  bio?: string;
  achievements?: string[];
  rank?: number;
  gamesPlayed?: number;
  wins?: number;
  losses?: number;
  joinDate?: string;
}

const defaultAchievements = [
  "First Win",
  "Mind Reader",
  "Doubt Master",
  "Trickster's Nemesis",
  "Manipulator's Apprentice"
];

const Profile = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    username: "",
    displayName: "",
    bio: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const email = localStorage.getItem("user_email");
    if (!email) {
      navigate("/auth");
      return;
    }

    // Load profile data
    const gender = localStorage.getItem("user_gender") || undefined;
    const age = localStorage.getItem("user_age") ? parseInt(localStorage.getItem("user_age") || "0") : undefined;
    const walletAddress = localStorage.getItem("wallet_address") || undefined;
    
    // Load game progress from localStorage
    let gameHistory;
    try {
      const gameHistoryStr = localStorage.getItem("gameHistory");
      gameHistory = gameHistoryStr ? JSON.parse(gameHistoryStr) : null;
    } catch (e) {
      gameHistory = null;
    }

    // Mock data for the profile
    setProfile({
      email,
      gender,
      age,
      walletAddress,
      username: localStorage.getItem("username") || email.split("@")[0],
      displayName: localStorage.getItem("displayName") || email.split("@")[0],
      bio: localStorage.getItem("bio") || "No bio provided yet.",
      achievements: ["First Login", "Profile Created"],
      rank: 42,
      gamesPlayed: gameHistory?.gamesPlayed || 0,
      wins: gameHistory?.wins || 0,
      losses: gameHistory?.losses || 0,
      joinDate: localStorage.getItem("joinDate") || new Date().toISOString().split('T')[0]
    });

    setFormData({
      username: localStorage.getItem("username") || email.split("@")[0],
      displayName: localStorage.getItem("displayName") || email.split("@")[0],
      bio: localStorage.getItem("bio") || "No bio provided yet.",
    });

    setIsAuthenticated(true);
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save to localStorage
    localStorage.setItem("username", formData.username);
    localStorage.setItem("displayName", formData.displayName);
    localStorage.setItem("bio", formData.bio);
    
    // Update profile state
    setProfile(prev => {
      if (!prev) return null;
      return { ...prev, ...formData };
    });
    
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handleLogout = () => {
    // Clear auth data but keep game history
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_age");
    localStorage.removeItem("user_gender");
    
    toast.success("Logged out successfully");
    navigate("/");
  };

  if (!isAuthenticated || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-purple-950 text-white p-8">
        <div className="flex justify-center items-center min-h-[50vh]">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-950 text-white p-4 md:p-8">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Sidebar */}
          <div className="w-full md:w-1/3">
            <Card className="bg-black/80 border-purple-500/30 overflow-hidden">
              <div className="h-24 bg-gradient-to-r from-purple-900 to-indigo-900"></div>
              <div className="px-6 -mt-12 pb-6">
                <Avatar className="h-24 w-24 border-4 border-black">
                  <AvatarImage src={`https://api.dicebear.com/7.x/personas/svg?seed=${profile.email}`} alt={profile.displayName} />
                  <AvatarFallback className="bg-purple-900">{profile.displayName?.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold mt-2 text-white">{profile.displayName}</h2>
                <p className="text-gray-400">@{profile.username}</p>
                
                <div className="mt-4">
                  <p className="text-sm text-gray-300">{profile.bio}</p>
                </div>
                
                <div className="mt-4 flex flex-col gap-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Rank</span>
                    <span className="text-purple-400 font-semibold">#{profile.rank}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Games</span>
                    <span>{profile.gamesPlayed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Win/Loss</span>
                    <span>{profile.wins}/{profile.losses}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Member Since</span>
                    <span>{profile.joinDate}</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  {profile.walletAddress && (
                    <div className="text-xs text-gray-400 truncate">
                      <span className="font-semibold">Wallet:</span> {profile.walletAddress?.substring(0, 8)}...{profile.walletAddress?.substring(profile.walletAddress.length - 6)}
                    </div>
                  )}
                </div>
                
                <div className="mt-6 space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full border-purple-500/50"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full border-red-500/50 hover:bg-red-900/30"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="w-full md:w-2/3">
            {isEditing ? (
              <Card className="bg-black/80 border-purple-500/30">
                <CardHeader>
                  <CardTitle>Edit Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="bg-transparent"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input
                        id="displayName"
                        name="displayName"
                        value={formData.displayName}
                        onChange={handleInputChange}
                        className="bg-transparent"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Input
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        className="bg-transparent"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                        Save Changes
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Tabs defaultValue="achievements">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="achievements">Achievements</TabsTrigger>
                  <TabsTrigger value="stats">Game Stats</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="achievements">
                  <Card className="bg-black/80 border-purple-500/30">
                    <CardHeader>
                      <CardTitle>Your Achievements</CardTitle>
                      <CardDescription>Badges and trophies you've earned playing Door of Illusions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {profile.achievements?.map((achievement, index) => (
                          <Badge key={index} className="bg-purple-600 hover:bg-purple-700">
                            {achievement}
                          </Badge>
                        ))}
                        {defaultAchievements.map((achievement, index) => (
                          <Badge key={`default-${index}`} variant="outline" className="text-gray-400 border-gray-700">
                            {achievement} (Locked)
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="stats">
                  <Card className="bg-black/80 border-purple-500/30">
                    <CardHeader>
                      <CardTitle>Game Statistics</CardTitle>
                      <CardDescription>Your performance in Door of Illusions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/30">
                            <p className="text-sm text-gray-400">Games Played</p>
                            <p className="text-2xl font-bold">{profile.gamesPlayed}</p>
                          </div>
                          <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/30">
                            <p className="text-sm text-gray-400">Win Rate</p>
                            <p className="text-2xl font-bold">
                              {profile.gamesPlayed ? 
                                Math.round((profile.wins || 0) / profile.gamesPlayed * 100) : 0}%
                            </p>
                          </div>
                          <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/30">
                            <p className="text-sm text-gray-400">Wins</p>
                            <p className="text-2xl font-bold text-green-400">{profile.wins}</p>
                          </div>
                          <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/30">
                            <p className="text-sm text-gray-400">Losses</p>
                            <p className="text-2xl font-bold text-red-400">{profile.losses}</p>
                          </div>
                        </div>
                        
                        <div className="bg-purple-900/10 p-4 rounded-lg border border-purple-500/20">
                          <p className="text-sm text-gray-400 mb-2">Recent Activity</p>
                          <p className="text-gray-300">No recent activity to display.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="settings">
                  <Card className="bg-black/80 border-purple-500/30">
                    <CardHeader>
                      <CardTitle>Account Settings</CardTitle>
                      <CardDescription>Manage your profile and preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-1">
                        <Label>Email Address</Label>
                        <div className="p-2 bg-purple-900/20 border border-purple-500/30 rounded-md">
                          <p className="text-gray-300">{profile.email}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <Label>Age</Label>
                        <div className="p-2 bg-purple-900/20 border border-purple-500/30 rounded-md">
                          <p className="text-gray-300">{profile.age}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <Label>Gender</Label>
                        <div className="p-2 bg-purple-900/20 border border-purple-500/30 rounded-md">
                          <p className="text-gray-300">{profile.gender || "Not specified"}</p>
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline"
                        className="border-purple-500/50" 
                        onClick={() => setIsEditing(true)}
                      >
                        Edit Profile
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
