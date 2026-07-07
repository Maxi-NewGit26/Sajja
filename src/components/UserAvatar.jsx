import React from 'react';

export const UserAvatar = ({ size = 'md', className = '' }) => {
  const customAvatar = localStorage.getItem('sajja_custom_avatar');

  const sizeClasses = {
    sm: 'w-10 h-10 text-lg border-2',
    md: 'w-16 h-16 text-2xl border-2',
    lg: 'w-24 h-24 text-4xl border-3',
  };

  const selectedSize = sizeClasses[size] || sizeClasses.md;

  if (customAvatar) {
    return (
      <div 
        className={`${selectedSize} rounded-full overflow-hidden border-gold-500 bg-parchment-200 flex items-center justify-center shadow-md relative flex-shrink-0 ${className}`}
      >
        <img 
          src={customAvatar} 
          alt="Profile Avatar" 
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // Fallback to default sacred emblem "ส"
  return (
    <div className={`${selectedSize} rounded-full bg-crimson-700 border-gold-500 flex items-center justify-center text-gold-300 font-serif-thai font-extrabold shadow-seal flex-shrink-0 ${className}`}>
      ส
    </div>
  );
};
export default UserAvatar;
