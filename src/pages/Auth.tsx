
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import Auth from '../components/auth/Auth';

// Fix the ethereum declaration to match the global window interface
declare global {
  interface Window {
    ethereum?: { 
      isMetaMask?: boolean; 
      request: (request: { method: string; params?: any[]; }) => Promise<any>; 
    }
  }
}

const AuthPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`Supabase auth event: ${event}`);
      setUser(session?.user ?? null);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      navigate('/game');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-950 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8">
        <span className="text-purple-400">Catch Me</span> if you <span className="text-purple-400">Can</span>
        <div className="text-sm text-gray-400 mt-2 font-normal">Door of Illusions</div>
      </h1>
      <div className="w-full max-w-md">
        <Auth />
      </div>
    </div>
  );
};

export default AuthPage;
