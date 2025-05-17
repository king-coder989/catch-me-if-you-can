
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ethers } from "ethers";

interface AuthProps {
  redirectTo?: string;
}

const Auth: React.FC<AuthProps> = ({ redirectTo = "/game" }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();

  const calculateAge = (dob: string): number => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const isOldEnough = (dob: string): boolean => {
    const age = calculateAge(dob);
    return age >= 16;
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPassword = (password: string) => {
    return password.length >= 6;
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        setIsConnecting(true);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
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

      if (!dateOfBirth) {
        toast.error("Please enter your date of birth.");
        setIsSubmitting(false);
        return;
      }

      if (!isOldEnough(dateOfBirth)) {
        toast.error("You must be at least 16 years old to sign up.");
        setIsSubmitting(false);
        return;
      }

      if (!gender) {
        toast.error("Please select your gender.");
        setIsSubmitting(false);
        return;
      }

      if (!walletAddress) {
        toast.error("MetaMask wallet connection is mandatory. Please connect your wallet to continue.");
        setIsSubmitting(false);
        return;
      }

      // For demo purposes, we'll just simulate success
      setTimeout(() => {
        localStorage.setItem("user_email", email);
        localStorage.setItem("user_dob", dateOfBirth);
        localStorage.setItem("user_gender", gender);
        localStorage.setItem("wallet_address", walletAddress);
        
        toast.success("Sign up successful!");
        navigate(redirectTo);
      }, 1500);

      // In a real app, you'd use Supabase or another auth provider:
      // const { error } = await supabase.auth.signUp({
      //   email,
      //   password,
      //   options: {
      //     data: {
      //       date_of_birth: dateOfBirth,
      //       gender,
      //       wallet_address: walletAddress
      //     }
      //   }
      // });
      // 
      // if (error) throw error;
    } catch (error) {
      console.error("Sign up error:", error);
      toast.error("Failed to sign up. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

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

      if (!walletAddress) {
        toast.error("MetaMask wallet connection is mandatory. Please connect your wallet to continue.");
        setIsSubmitting(false);
        return;
      }

      // For demo purposes, we'll just simulate success
      setTimeout(() => {
        localStorage.setItem("user_email", email);
        localStorage.setItem("wallet_address", walletAddress);
        
        toast.success("Sign in successful!");
        navigate(redirectTo);
      }, 1500);

      // In a real app, you'd use Supabase or another auth provider:
      // const { error } = await supabase.auth.signInWithPassword({
      //   email,
      //   password,
      // });
      // 
      // if (error) throw error;
    } catch (error) {
      console.error("Sign in error:", error);
      toast.error("Failed to sign in. Please check your credentials and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[85vh] px-4">
      <Card className="w-full max-w-md bg-black/80 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-purple-400">Account Access</CardTitle>
          <CardDescription className="text-center text-gray-300">
            Sign in or create an account to play Catch Me If You Can
          </CardDescription>
        </CardHeader>
        <Tabs defaultValue="signup" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signup">
            <form onSubmit={handleSignUp}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input 
                    id="signup-email" 
                    type="email" 
                    placeholder="your@email.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
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
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input 
                    id="confirm-password" 
                    type="password" 
                    placeholder="••••••••" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date-of-birth">Date of Birth</Label>
                  <Input 
                    id="date-of-birth" 
                    type="date" 
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    required
                    max={new Date().toISOString().split('T')[0]}
                  />
                  <p className="text-xs text-red-400">You must be at least 16 years old to play.</p>
                </div>
                
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <RadioGroup value={gender} onValueChange={setGender} className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other">Other</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label>MetaMask Wallet <span className="text-red-400">*</span></Label>
                  {walletAddress ? (
                    <div className="p-2 bg-purple-900/20 border border-purple-500/30 rounded-md overflow-hidden">
                      <p className="text-sm text-gray-300 truncate">{walletAddress}</p>
                    </div>
                  ) : (
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full border-purple-500/50" 
                      onClick={connectWallet}
                      disabled={isConnecting}
                    >
                      {isConnecting ? "Connecting..." : "Connect MetaMask Wallet"}
                    </Button>
                  )}
                  <p className="text-xs text-red-400">MetaMask wallet is required to track achievements on-chain</p>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full bg-purple-600 hover:bg-purple-700" 
                  disabled={isSubmitting || !walletAddress}
                >
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="signin">
            <form onSubmit={handleSignIn}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input 
                    id="signin-email" 
                    type="email" 
                    placeholder="your@email.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
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
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>MetaMask Wallet <span className="text-red-400">*</span></Label>
                  {walletAddress ? (
                    <div className="p-2 bg-purple-900/20 border border-purple-500/30 rounded-md overflow-hidden">
                      <p className="text-sm text-gray-300 truncate">{walletAddress}</p>
                    </div>
                  ) : (
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full border-purple-500/50" 
                      onClick={connectWallet}
                      disabled={isConnecting}
                    >
                      {isConnecting ? "Connecting..." : "Connect MetaMask Wallet"}
                    </Button>
                  )}
                  <p className="text-xs text-red-400">MetaMask wallet is required to access your game progress</p>
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col gap-4">
                <Button 
                  type="submit" 
                  className="w-full bg-purple-600 hover:bg-purple-700" 
                  disabled={isSubmitting || !walletAddress}
                >
                  {isSubmitting ? "Signing In..." : "Sign In"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Auth;
