
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Landing from "./pages/Landing";
import Game from "@/components/Game";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Careers from "./pages/Careers";
import Profile from "./pages/Profile";
import Leaderboard from "./pages/Leaderboard";
import AuthPage from "./pages/Auth";
import { GameProvider } from "./contexts/GameContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner theme="dark" toastOptions={{
        style: {
          background: 'rgba(0,0,0,0.9)',
          color: '#ffffff',
          border: '1px solid rgba(139, 92, 246, 0.3)'
        }
      }} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Landing />} />
            <Route path="/about" element={<About />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route 
              path="/game" 
              element={
                <GameProvider>
                  <Game />
                </GameProvider>
              } 
            />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
