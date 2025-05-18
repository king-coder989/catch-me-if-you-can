
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Auth from '../components/auth/Auth';

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (request: { method: string; params?: any[] }) => Promise<any>;
    };
  }
}

const AuthPage = () => {
  const [isWeb3Available, setIsWeb3Available] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkWeb3 = async () => {
      // Check if MetaMask is installed
      if (window.ethereum) {
        setIsWeb3Available(true);
      }
    };

    checkWeb3();
  }, []);

  if (isAuthenticated) {
    return <Navigate to="/game" replace />;
  }

  return <Auth onAuthSuccess={() => setIsAuthenticated(true)} isWeb3Available={isWeb3Available} />;
};

export default AuthPage;
