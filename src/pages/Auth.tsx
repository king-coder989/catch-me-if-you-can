
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Auth as SupaAuth } from '../components/auth/Auth';

declare global {
  interface Window {
    ethereum?: any;
  }
}

const Auth = () => {
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
        <span className="text-purple-400">Door</span> of <span className="text-purple-400">Illusions</span>
      </h1>
      <div className="w-full max-w-md">
        <SupaAuth />
      </div>
    </div>
  );
};

export default Auth;
