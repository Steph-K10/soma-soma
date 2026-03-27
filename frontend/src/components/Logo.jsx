import React from 'react';

const Logo = ({ className = "w-10 h-10", variant = "light" }) => {
  return (
    <svg 
      className={className}
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={variant === "light" ? "#FF6B9D" : "#C084FC"} />
          <stop offset="100%" stopColor={variant === "light" ? "#C084FC" : "#FF6B9D"} />
        </linearGradient>
      </defs>
      
      {/* Outer circle */}
      <circle cx="50" cy="50" r="45" fill="url(#gradient)" opacity="0.2" />
      
      {/* S S monogram */}
      <path 
        d="M35 35 L65 35 L55 50 L65 65 L35 65 L45 50 L35 35Z" 
        fill="url(#gradient)"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="drop-shadow-lg"
      />
      
      {/* Decorative dots */}
      <circle cx="50" cy="50" r="3" fill="url(#gradient)" />
      <circle cx="30" cy="40" r="2" fill="url(#gradient)" opacity="0.6" />
      <circle cx="70" cy="40" r="2" fill="url(#gradient)" opacity="0.6" />
      <circle cx="30" cy="60" r="2" fill="url(#gradient)" opacity="0.6" />
      <circle cx="70" cy="60" r="2" fill="url(#gradient)" opacity="0.6" />
    </svg>
  );
};

export default Logo;