
import React from 'react';
import { useAuth } from '../../lib/AuthContext';
import { 
  ShieldCheck, 
  MapPin, 
  Heart,
  ChevronDown,
  LogOut
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup,
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { getFirebaseAuthErrorMessage } from '../../lib/authErrors';

export function RoleSwitcher() {
  const { user, login, logout } = useAuth();

  const handleQuickSignIn = async () => {
    try {
      await login();
      toast.success('Successfully signed in!');
    } catch (err) {
      console.warn('Quick sign-in error:', err);
      toast.error(getFirebaseAuthErrorMessage(err));
    }
  };

  if (!user) return (
    <Button onClick={handleQuickSignIn} variant="outline" className="rounded-xl border-white/40 bg-white/50">
      Sign In
    </Button>
  );

  return (
    <div className="flex items-center gap-3">
      <DropdownMenu>
        <DropdownMenuTrigger
          variant="ghost"
          className="flex items-center gap-3 p-2 h-auto hover:bg-white/50 transition-colors rounded-xl border border-transparent hover:border-white/40"
        >
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold leading-none text-slate-900">{user.fullName}</p>
            <p className="text-[10px] text-blue-500 font-medium uppercase tracking-wider">{user.role}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white overflow-hidden flex items-center justify-center">
            {user.role.includes('Admin') ? (
              <ShieldCheck className="h-5 w-5 text-blue-600" />
            ) : user.role === 'Missionary' ? (
              <MapPin className="h-5 w-5 text-blue-600" />
            ) : (
              <Heart className="h-5 w-5 text-blue-600" />
            )}
          </div>
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 glass-card border-white/40">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-rose-600 focus:text-rose-600 cursor-pointer">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
