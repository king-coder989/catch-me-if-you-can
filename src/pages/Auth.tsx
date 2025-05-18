
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

// Add window.ethereum to TypeScript
declare global {
  interface Window {
    ethereum?: any;
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
  const checkAge = (birthDate: string): boolean => {
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
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
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
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Success message
      toast({
        title: "Account Created!",
        description: "Your account has been successfully created."
      });
      
      // Redirect after successful signup
      setTimeout(() => {
        navigate(redirectTo);
      }, 1500);
    } catch (error) {
      console.error("Sign up error:", error);
      toast({
        description: "Failed to sign up. Please try again later.",
        variant: "destructive"
      });
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
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Success message
      toast({
        title: "Welcome Back!",
        description: "You have been successfully logged in."
      });
      
      // Redirect after successful signin
      setTimeout(() => {
        navigate(redirectTo);
      }, 1500);
    } catch (error) {
      console.error("Sign in error:", error);
      toast({
        description: "Failed to sign in. Please check your credentials and try again.",
        variant: "destructive"
      });
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
                    <Label htmlFor="email-signin">Email</Label>
                    <Input 
                      id="email-signin" 
                      type="email" 
                      placeholder="your@email.com" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-signin">Password</Label>
                    <Input 
                      id="password-signin" 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div className="pt-2">
                    <p className="text-xs text-gray-400 mb-2">Connected wallet: {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}</p>
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
                    <Label htmlFor="email-signup">Email</Label>
                    <Input 
                      id="email-signup" 
                      type="email" 
                      placeholder="your@email.com" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-signup">Password</Label>
                    <Input 
                      id="password-signup" 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input 
                      id="dob" 
                      type="date" 
                      required
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                    {!isOfAge && dateOfBirth && (
                      <p className="text-xs text-red-500">You must be 18 or older to use this application.</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select 
                      value={gender} 
                      onValueChange={(value) => setGender(value)}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Select your gender" />
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
                    <p className="text-xs text-gray-400 mb-2">Connected wallet: {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}</p>
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
        <CardFooter>
          <p className="text-xs text-center w-full text-gray-400">
            By connecting your wallet, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;
