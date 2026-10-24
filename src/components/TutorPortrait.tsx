import React, { useState } from 'react';
import { GraduationCap } from 'lucide-react';

interface TutorPortraitProps {
  src: string;
  name: string;
  initials: string;
  accentHex?: string;
  sizeClass?: string;
  roundedClass?: string;
}

export const TutorPortrait: React.FC<TutorPortraitProps> = ({
  src,
  name,
  initials,
  accentHex = '#0f172a',
  sizeClass = 'w-16 h-16',
  roundedClass = 'rounded-xl',
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={`relative overflow-hidden shrink-0 bg-slate-900 border border-slate-200/80 flex items-center justify-center ${sizeClass} ${roundedClass}`}
      style={{ backgroundColor: accentHex }}
    >
      {!imageError && src ? (
        <img
          src={src}
          alt={`Retrato profesional de ${name}`}
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-white select-none">
          <GraduationCap className="w-5 h-5 opacity-80 mb-0.5" />
          <span className="text-xs font-semibold tracking-tight font-mono">{initials}</span>
        </div>
      )}
    </div>
  );
};
