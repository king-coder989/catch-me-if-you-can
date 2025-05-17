import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { MetaMaskIcon } from '@/components/auth/MetaMaskIcon';

// Define ethereum interface for window
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (options: { method: string; params?: any[] }) => Promise<any>;
    }
  }
}

const Auth = () => {
  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("prefer-not-to-say");
  const [walletAddress, setWalletAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isOfAge, setIsOfAge] = useState(true);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Get redirect path from location state or default to /game
  const redirectTo = location.state?.from?.pathname || '/game';

  // Calculate if user is of legal age (18+)
  const checkAge = (birthDate: string) => {
    if (!birthDate) return false;
    
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDifference = today.getMonth() - birthDateObj.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
    
    return age >= 18;
  };

  // Effect to validate age when date of birth changes
  useEffect(() => {
    setIsOfAge(checkAge(dateOfBirth));
  }, [dateOfBirth]);

  // Connect MetaMask wallet
  const connectWallet = async () => {
    if (!window.ethereum) {
      toast({
        title: "MetaMask Required",
        description: "Please install MetaMask to continue.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setIsWalletConnected(true);
        toast({
          title: "Wallet Connected",
          description: "Your MetaMask wallet has been connected successfully."
        });
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to MetaMask. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sign up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate wallet connection
    if (!isWalletConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your MetaMask wallet to sign up.",
        variant: "destructive"
      });
      return;
    }
    
    // Validate age
    if (!isOfAge) {
      toast({
        title: "Age Restriction",
        description: "You must be 18 or older to use this application.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Simulate signup process (normally would interact with backend)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Account Created!",
        description: "Your account has been successfully created."
      });
      
      // Redirect after successful signup
      setTimeout(() => {
        toast.success("Sign up successful!");
        navigate(redirectTo);
      }, 1500);
    } catch (error) {
      console.error("Sign up error:", error);
      toast.error("Failed to sign up. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sign in
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate wallet connection
    if (!isWalletConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your MetaMask wallet to sign in.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Simulate signin process (normally would interact with backend)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Welcome Back!",
        description: "You have been successfully logged in."
      });
      
      // Redirect after successful signin
      setTimeout(() => {
        toast.success("Sign in successful!");
        navigate(redirectTo);
      }, 1500);
    } catch (error) {
      console.error("Sign in error:", error);
      toast.error("Failed to sign in. Please check your credentials and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-black/70 border-purple-500/30">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-white">
            Authentication Required
          </CardTitle>
          <CardDescription className="text-center text-purple-300">
            Connect your wallet and sign in to play Catch Me If You Can.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isWalletConnected ? (
            <div className="flex flex-col space-y-4 items-center">
              <p className="text-sm text-purple-300">
                MetaMask wallet connection is required to track your game progress and achievements.
              </p>
              <Button 
                onClick={connectWallet} 
                disabled={isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                <MetaMaskIcon className="mr-2 h-5 w-5" />
                {isLoading ? "Connecting..." : "Connect MetaMask"}
              </Button>
            </div>
          ) : (
            <Tabs defaultValue="signin">
              <TabsList className="grid w-full grid-cols-2 mb-4 bg-purple-900/50">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-purple-950/30 border-purple-500/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-purple-950/30 border-purple-500/30"
                    />
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      type="submit" 
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing In..." : "Sign In"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-purple-950/30 border-purple-500/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-purple-950/30 border-purple-500/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date-of-birth">Date of Birth <span className="text-xs text-red-400">(18+ required)</span></Label>
                    <Input
                      id="date-of-birth"
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      required
                      className="bg-purple-950/30 border-purple-500/30"
                    />
                    {!isOfAge && dateOfBirth && (
                      <p className="text-sm text-red-400 mt-1">You must be 18 or older to play.</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender (Optional)</Label>
                    <Select value={gender} onValueChange={setGender}>
                      <SelectTrigger className="bg-purple-950/30 border-purple-500/30">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="non-binary">Non-binary</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      type="submit" 
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      disabled={isLoading || !isOfAge}
                    >
                      {isLoading ? "Signing Up..." : "Sign Up"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-xs text-purple-300 text-center w-full">
            By signing in, you agree to our <a href="#" className="text-purple-400 hover:underline">Terms of Service</a> and <a href="#" className="text-purple-400 hover:underline">Privacy Policy</a>.
          </div>
          <div className="text-xs text-purple-300 text-center w-full">
            <span className="text-red-400">Age Restriction:</span> This game is for adults 18 and older.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;
