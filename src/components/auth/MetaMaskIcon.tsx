
import React from 'react';

export const MetaMaskIcon = ({ className }: { className?: string }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 512 512" 
      className={className}
      fill="currentColor"
    >
      <path d="M448.1 136.2l-35.6 129.5-52.2-202.2H139.6l-52.2 202.2-35.6-129.5L0 278.6 50.5 512h109l60.3-319.5h45.1l-5.2 24.7c16.5-9 35.5-13.5 56.7-12.4l26.2-12.3h95.9l4.3 19.9c15-8 32.2-12.5 50.6-12.5 18.6 0 37.1 4.9 51.7 12.5l4.3-19.9h92.4l-48.2 237.9H311.8l13-64.2c-12 7.2-26.3 11.5-40.1 11.5-14.1 0-28.7-4.5-40.5-11.8l13.1 64.5H157.9l-70.1-339h417.4z"/>
    </svg>
  );
};

export default MetaMaskIcon;
