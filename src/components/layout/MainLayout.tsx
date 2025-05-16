
import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { SocialFooter } from './SocialFooter';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="py-4 px-6 border-b border-purple-900/30 bg-black/80 backdrop-blur-sm fixed w-full z-10">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-white">
            <span className="text-purple-400">Door</span> of <span className="text-purple-400">Illusions</span>
          </Link>
          
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-white hover:bg-purple-900/50">
                  Menu
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-black/95 border border-purple-900">
                  <div className="grid w-[300px] gap-2 p-4">
                    <NavigationMenuLink asChild>
                      <Link to="/" className="block p-2 hover:bg-purple-900/30 rounded">Home</Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link to="/game" className="block p-2 hover:bg-purple-900/30 rounded">Play Game</Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link to="/about" className="block p-2 hover:bg-purple-900/30 rounded">About</Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link to="/careers" className="block p-2 hover:bg-purple-900/30 rounded">Careers</Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link to="/profile" className="block p-2 hover:bg-purple-900/30 rounded">Profile</Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link to="/leaderboard" className="block p-2 hover:bg-purple-900/30 rounded">Leaderboard</Link>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          <Link to="/game">
            <Button variant="default" className="bg-purple-600 hover:bg-purple-700">Play Now</Button>
          </Link>
        </div>
      </header>

      <main className="flex-grow pt-20">
        <Outlet />
      </main>
      
      <SocialFooter />
    </div>
  );
};

export default MainLayout;
