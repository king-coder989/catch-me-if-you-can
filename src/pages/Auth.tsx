
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Wallet } from "lucide-react";

// Define window ethereum interface for TypeScript
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (request: { method: string; params?: any[] }) => Promise<any>;
    };
  }
}

const Auth = () => {
  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [gender, setGender] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  
  // Validation functions
  const isValidAge = (age: number | ""): boolean => {
    return typeof age === "number" && age >= 16;
  };
  
  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  
  const isValidPassword = (password: string): boolean => {
    return password.length >= 6;
  };
  
  // Connect to MetaMask wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        setIsConnecting(true);
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        
        // Get the first account
        const address = accounts[0];
        setWalletAddress(address);
        toast.success("Wallet connected successfully!");
      } catch (error) {
        console.error("Error connecting wallet:", error);
        toast.error("Failed to connect wallet. Please try again.");
      } finally {
        setIsConnecting(false);
      }
    } else {
      toast.error("MetaMask is not installed. Please install it to connect your wallet.");
    }
  };
  
  // Handle sign up form submission
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate form inputs
      if (!isValidEmail(email)) {
        toast.error("Please enter a valid email address.");
        setIsSubmitting(false);
        return;
      }
      
      if (!isValidPassword(password)) {
        toast.error("Password must be at least 6 characters long.");
        setIsSubmitting(false);
        return;
      }
      
      if (password !== confirmPassword) {
        toast.error("Passwords do not match.");
        setIsSubmitting(false);
        return;
      }
      
      if (!isValidAge(Number(age))) {
        toast.error("You must be at least 16 years old to sign up.");
        setIsSubmitting(false);
        return;
      }
      
      if (!gender) {
        toast.error("Please select your gender.");
        setIsSubmitting(false);
        return;
      }
      
      // For demo purposes, we'll just simulate success
      setTimeout(() => {
        // Store user data in localStorage
        localStorage.setItem("user_email", email);
        localStorage.setItem("user_age", String(age));
        localStorage.setItem("user_gender", gender);
        
        if (walletAddress) {
          localStorage.setItem("wallet_address", walletAddress);
        }
        
        toast.success("Sign up successful!");
        navigate("/game");
      }, 1500);
      
    } catch (error) {
      console.error("Sign up error:", error);
      toast.error("Failed to sign up. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle sign in form submission
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate form inputs
      if (!isValidEmail(email)) {
        toast.error("Please enter a valid email address.");
        setIsSubmitting(false);
        return;
      }
      
      if (!isValidPassword(password)) {
        toast.error("Password must be at least 6 characters long.");
        setIsSubmitting(false);
        return;
      }
      
      // For demo purposes, we'll just simulate success
      setTimeout(() => {
        localStorage.setItem("user_email", email);
        toast.success("Sign in successful!");
        navigate("/game");
      }, 1500);
      
    } catch (error) {
      console.error("Sign in error:", error);
      toast.error("Failed to sign in. Please check your credentials and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="flex justify-center items-center min-h-[85vh] px-4 bg-gradient-to-b from-black to-purple-950">
      <Card className="w-full max-w-md bg-black/80 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-purple-400">
            Account Access
          </CardTitle>
          <CardDescription className="text-center text-gray-300">
            Sign in or create an account to play Door of Illusions
          </CardDescription>
        </CardHeader>
        
        <Tabs defaultValue="signup" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          {/* Sign Up Form */}
          <TabsContent value="signup">
            <form onSubmit={handleSignUp}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-white">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="youremail@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-white">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="******"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-white">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="******"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-white">Age (Must be 16+)</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Enter your age"
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value) || "")}
                    required
                    min={16}
                  />
                </div>
                
                <div className="space-y-3">
                  <Label className="text-white">Gender</Label>
                  <RadioGroup value={gender} onValueChange={setGender} className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male" className="text-gray-200">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female" className="text-gray-200">Female</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other" className="text-gray-200">Other</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="border-t border-gray-700 pt-4">
                  <Label className="text-white mb-2 block">Connect Wallet (Optional)</Label>
                  {walletAddress ? (
                    <div className="bg-purple-900/30 p-3 rounded border border-purple-500/30 break-words text-gray-300 text-sm">
                      {walletAddress}
                    </div>
                  ) : (
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full border-purple-500"
                      onClick={connectWallet}
                      disabled={isConnecting}
                    >
                      <Wallet className="mr-2 h-4 w-4" />
                      {isConnecting ? "Connecting..." : "Connect MetaMask"}
                    </Button>
                  )}
                </div>
              </CardContent>
              
              <CardContent className="pt-0">
                <Button 
                  type="submit" 
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating Account..." : "Sign Up"}
                </Button>
              </CardContent>
            </form>
          </TabsContent>
          
          {/* Sign In Form */}
          <TabsContent value="signin">
            <form onSubmit={handleSignIn}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-white">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="youremail@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="text-white">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="******"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              
              <CardContent className="pt-0">
                <Button 
                  type="submit" 
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing In..." : "Sign In"}
                </Button>
              </CardContent>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Auth;
