
import React from 'react';
import { Navigate } from 'react-router-dom';

const Index = () => {
  // Redirect to the landing page
  return <Navigate to="/" replace />;
};

export default Index;
