import React from 'react';
import { Compass, User, RefreshCcw, ArrowLeft } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Link, useNavigate } from 'react-router-dom';

interface PathfinderHeaderProps {
  user: any;
  profile: any;
  onShowProfile: () => void;
  onReset?: () => void;
  showReset?: boolean;
  showBack?: boolean;
  isRoot?: boolean;
}

export const PathfinderHeader: React.FC<PathfinderHeaderProps> = ({ 
  user, 
  profile, 
  onShowProfile, 
  onReset, 
  showReset = false,
  showBack = true,
  isRoot = false 
}) => {
  const navigate = useNavigate();

  return (
    <header className={cn(
      "flex justify-between items-center",
      isRoot ? "mb-0" : "mb-12"
    )}>
      <div className="flex items-center gap-6">
        {showBack && !isRoot && (
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5 transition-all group"
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>
        )}
        
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <Compass className="text-black w-6 h-6" />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white">PATHFINDER</h1>
        </Link>
      </div>
      
      <div className="flex items-center gap-4">
        {!isRoot && (
          <button 
            onClick={onShowProfile}
            className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors text-sm font-medium bg-white/5 px-4 py-2 rounded-full border border-white/10"
          >
            {user ? (
              <img src={user.photoURL} alt={user.displayName} className="w-5 h-5 rounded-full border border-white/20" />
            ) : (
              <User className="w-4 h-4" />
            )}
            <span className="truncate max-w-[100px]">
              {user ? user.displayName : (profile?.profession || "Set Profile")}
            </span>
          </button>
        )}
        
        {showReset && onReset && (
          <button 
            onClick={onReset}
            className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors text-sm font-medium"
          >
            <RefreshCcw className="w-4 h-4" />
            Reset
          </button>
        )}
      </div>
    </header>
  );
};
