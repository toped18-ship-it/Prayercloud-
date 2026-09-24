import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cloud, 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  User, 
  Globe, 
  Eye, 
  EyeOff, 
  CheckCircle2,
  AlertCircle,
  X
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { toast } from 'sonner';
import { useAuth } from '../lib/AuthContext';
import { UserRole } from '../types';
import { getFirebaseAuthErrorMessage } from '../lib/authErrors';

export default function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithEmail, signUpWithEmail } = useAuth();

  // Determine initial mode based on route
  const isRegisterRoute = location.pathname === '/register';
  const [mode, setMode] = useState<'signin' | 'signup'>(isRegisterRoute ? 'signup' : 'signin');

  // Direct UI Error State
  const [authError, setAuthError] = useState<string | null>(null);
  const [adminError, setAdminError] = useState<string | null>(null);

  useEffect(() => {
    if (location.pathname === '/register') {
      setMode('signup');
      setAuthError(null);
    } else if (location.pathname === '/login') {
      setMode('signin');
      setAuthError(null);
    }
  }, [location.pathname]);

  const switchMode = (newMode: 'signin' | 'signup') => {
    setMode(newMode);
    setAuthError(null);
  };

  // Sign In State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Sign Up State
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('Missionary');
  const [country, setCountry] = useState('Global');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);

  // Admin Direct Login Toggle
  const [showAdminAccess, setShowAdminAccess] = useState(false);
  const [adminEmail, setAdminEmail] = useState('admin@prayercloud.org');
  const [adminPassword, setAdminPassword] = useState('');

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    try {
      await login();
      toast.success('Successfully signed in with Google!');
      navigate('/home');
    } catch (error) {
      console.warn('Google sign-in error:', error);
      const friendlyMessage = getFirebaseAuthErrorMessage(error);
      setAuthError(friendlyMessage);
      toast.error(friendlyMessage);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!loginEmail.trim() || !loginPassword) {
      const msg = 'Please enter both email and password.';
      setAuthError(msg);
      toast.error(msg);
      return;
    }

    setIsLoggingIn(true);
    try {
      await loginWithEmail(loginEmail.trim(), loginPassword);
      toast.success('Successfully signed in!');
      navigate('/home');
    } catch (err: unknown) {
      console.warn('Email login error:', err);
      const friendlyMessage = getFirebaseAuthErrorMessage(err);
      setAuthError(friendlyMessage);
      toast.error(friendlyMessage);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!fullName.trim()) {
      const msg = 'Please enter your full name.';
      setAuthError(msg);
      toast.error(msg);
      return;
    }
    if (!signupEmail.trim()) {
      const msg = 'Please enter your email address.';
      setAuthError(msg);
      toast.error(msg);
      return;
    }
    if (signupPassword.length < 6) {
      const msg = 'Password must be at least 6 characters long.';
      setAuthError(msg);
      toast.error(msg);
      return;
    }
    if (signupPassword !== confirmPassword) {
      const msg = 'Passwords do not match. Please verify.';
      setAuthError(msg);
      toast.error(msg);
      return;
    }

    setIsSigningUp(true);
    try {
      await signUpWithEmail(signupEmail.trim(), signupPassword, fullName.trim(), role, country.trim() || 'Global');
      toast.success('Account created successfully! Welcome to PRAYERCLOUD.');
      navigate('/home');
    } catch (err: unknown) {
      console.warn('Sign-up error:', err);
      const friendlyMessage = getFirebaseAuthErrorMessage(err);
      setAuthError(friendlyMessage);
      toast.error(friendlyMessage);
      if (friendlyMessage.includes('already registered')) {
        setLoginEmail(signupEmail.trim());
      }
    } finally {
      setIsSigningUp(false);
    }
  };

  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);

    if (!adminEmail.trim() || !adminPassword) {
      const msg = 'Please enter both administrative email and security key.';
      setAdminError(msg);
      toast.error(msg);
      return;
    }

    setIsLoggingIn(true);
    try {
      await loginWithEmail(adminEmail.trim(), adminPassword);
      toast.success('Admin safety access granted!');
      navigate('/admin');
    } catch (err: unknown) {
      console.warn('Admin sign-in error:', err);
      const friendlyMessage = getFirebaseAuthErrorMessage(err);
      setAdminError(friendlyMessage);
      toast.error(friendlyMessage);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden pt-20 pb-16">
      {/* Abstract decor */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 transform origin-top-right -z-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-xl"
      >
        <Card className="shadow-2xl border-slate-200">
          <CardHeader className="space-y-4 pb-6 text-center">
            <Link to="/" className="mx-auto block group">
              <div className="bg-primary w-12 h-12 rounded-xl flex items-center justify-center mx-auto shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                <Cloud className="text-white h-7 w-7" />
              </div>
            </Link>
            <div className="space-y-1">
              <CardTitle className="text-3xl font-display font-bold text-slate-900">
                {mode === 'signin' ? 'Welcome Back' : 'Create an Account'}
              </CardTitle>
              <CardDescription className="text-sm sm:text-base text-slate-500">
                {mode === 'signin'
                  ? 'Access your mission console, dispatch prayers, and coordinate field teams.'
                  : 'Join the global network of intercessors, field workers, and mission leaders.'}
              </CardDescription>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl max-w-xs mx-auto border border-slate-200/80">
              <button
                type="button"
                onClick={() => switchMode('signin')}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                  mode === 'signin'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => switchMode('signup')}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                  mode === 'signup'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign Up
              </button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-2">
            {/* Quick Google Sign In button (always available for easy 1-click access) */}
            <div className="space-y-2">
              <Button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full h-12 bg-white border border-slate-200 text-slate-900 hover:bg-slate-50 flex items-center justify-center gap-3 transition-all shadow-sm active:scale-[0.99]"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span>{mode === 'signin' ? 'Continue with Google' : 'Sign up with Google'}</span>
              </Button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-slate-400 font-semibold tracking-wider">
                    Or with email credentials
                  </span>
                </div>
              </div>
            </div>

            {/* Direct In-UI Firebase Authentication Error Alert */}
            <AnimatePresence>
              {authError && (
                <motion.div
                  key="auth-error-alert"
                  initial={{ opacity: 0, y: -6, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -6, height: 0 }}
                  transition={{ duration: 0.2 }}
                  role="alert"
                  aria-live="assertive"
                  className="overflow-hidden"
                >
                  <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 text-rose-900 shadow-sm flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <AlertCircle className="h-5 w-5 text-rose-600 mt-0.5 shrink-0" />
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-rose-950 uppercase tracking-wide">
                          Authentication Notice
                        </p>
                        <p className="text-sm font-medium text-rose-800 leading-snug">
                          {authError}
                        </p>
                        {authError.includes('already registered') && mode === 'signup' && (
                          <button
                            type="button"
                            onClick={() => {
                              setLoginEmail(signupEmail);
                              switchMode('signin');
                            }}
                            className="text-xs font-semibold text-rose-700 underline hover:text-rose-950 pt-0.5 block text-left"
                          >
                            Switch to sign in with this email &rarr;
                          </button>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAuthError(null)}
                      className="text-rose-400 hover:text-rose-700 p-1 rounded-md transition-colors shrink-0"
                      aria-label="Dismiss error message"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form Toggle: Sign In vs Sign Up */}
            <AnimatePresence mode="wait">
              {mode === 'signin' ? (
                /* ================= SIGN IN FORM ================= */
                <motion.form
                  key="signin-form"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  onSubmit={handleEmailSignIn}
                  className="space-y-4"
                >
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center">
                      <Mail className="h-3.5 w-3.5 mr-1.5 text-slate-400" /> Email Address
                    </label>
                    <Input
                      type="email"
                      placeholder="missionary@prayercloud.org"
                      className={`h-11 bg-white transition-colors ${authError ? 'border-rose-300 focus-visible:ring-rose-500' : ''}`}
                      required
                      value={loginEmail}
                      onChange={(e) => {
                        setLoginEmail(e.target.value);
                        if (authError) setAuthError(null);
                      }}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center">
                        <Lock className="h-3.5 w-3.5 mr-1.5 text-slate-400" /> Password
                      </label>
                      <button
                        type="button"
                        onClick={() => toast.info('To reset your password, contact your mission coordinator or administrator.')}
                        className="text-xs text-primary hover:underline font-medium"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Input
                        type={showLoginPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className={`h-11 bg-white pr-10 transition-colors ${authError ? 'border-rose-300 focus-visible:ring-rose-500' : ''}`}
                        required
                        value={loginPassword}
                        onChange={(e) => {
                          setLoginPassword(e.target.value);
                          if (authError) setAuthError(null);
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        tabIndex={-1}
                      >
                        {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    disabled={isLoggingIn}
                    type="submit"
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-sm font-semibold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 mt-2"
                  >
                    {isLoggingIn ? 'Authenticating...' : 'Sign In to PrayerCloud'}
                    <ArrowRight className="h-4 w-4" />
                  </Button>

                  <div className="text-center pt-2">
                    <p className="text-xs text-slate-500">
                      Don&apos;t have an account yet?{' '}
                      <button
                        type="button"
                        onClick={() => switchMode('signup')}
                        className="text-primary font-bold hover:underline"
                      >
                        Create an account
                      </button>
                    </p>
                  </div>
                </motion.form>
              ) : (
                /* ================= SIGN UP FORM ================= */
                <motion.form
                  key="signup-form"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onSubmit={handleEmailSignUp}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center">
                        <User className="h-3.5 w-3.5 mr-1.5 text-slate-400" /> Full Name
                      </label>
                      <Input
                        type="text"
                        placeholder="Sister Mary / Bro David"
                        className={`h-11 bg-white transition-colors ${authError && authError.includes('full name') ? 'border-rose-300 focus-visible:ring-rose-500' : ''}`}
                        required
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          if (authError) setAuthError(null);
                        }}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center">
                        <Mail className="h-3.5 w-3.5 mr-1.5 text-slate-400" /> Email Address
                      </label>
                      <Input
                        type="email"
                        placeholder="you@fieldmission.org"
                        className={`h-11 bg-white transition-colors ${authError && (authError.includes('email') || authError.includes('registered')) ? 'border-rose-300 focus-visible:ring-rose-500' : ''}`}
                        required
                        value={signupEmail}
                        onChange={(e) => {
                          setSignupEmail(e.target.value);
                          if (authError) setAuthError(null);
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center">
                        <ShieldCheck className="h-3.5 w-3.5 mr-1.5 text-slate-400" /> Mission Calling / Role
                      </label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value as UserRole)}
                        className="w-full h-11 px-3 rounded-md border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-medium"
                      >
                        <option value="Missionary">Missionary (Field Worker)</option>
                        <option value="Prayer Warrior">Prayer Warrior</option>
                        <option value="Intercessor">Intercessor</option>
                        <option value="Pastor">Pastor / Church Leader</option>
                        <option value="Evangelist">Evangelist</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center">
                        <Globe className="h-3.5 w-3.5 mr-1.5 text-slate-400" /> Assigned Country / Region
                      </label>
                      <Input
                        type="text"
                        placeholder="Global or Country Name"
                        className="h-11 bg-white"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center">
                        <Lock className="h-3.5 w-3.5 mr-1.5 text-slate-400" /> Password
                      </label>
                      <div className="relative">
                        <Input
                          type={showSignupPassword ? 'text' : 'password'}
                          placeholder="Min. 6 characters"
                          className={`h-11 bg-white pr-10 transition-colors ${authError && authError.includes('Password') ? 'border-rose-300 focus-visible:ring-rose-500' : ''}`}
                          required
                          value={signupPassword}
                          onChange={(e) => {
                            setSignupPassword(e.target.value);
                            if (authError) setAuthError(null);
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowSignupPassword(!showSignupPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          tabIndex={-1}
                        >
                          {showSignupPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center">
                        <Lock className="h-3.5 w-3.5 mr-1.5 text-slate-400" /> Confirm Password
                      </label>
                      <Input
                        type={showSignupPassword ? 'text' : 'password'}
                        placeholder="Re-enter password"
                        className={`h-11 bg-white transition-colors ${authError && authError.includes('match') ? 'border-rose-300 focus-visible:ring-rose-500' : ''}`}
                        required
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (authError) setAuthError(null);
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-2 pt-1 text-xs text-slate-500">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span>
                      By signing up, you agree to coordinate in accordance with kingdom ethics and mission privacy covenants.
                    </span>
                  </div>

                  <Button
                    disabled={isSigningUp}
                    type="submit"
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-sm font-semibold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 mt-2"
                  >
                    {isSigningUp ? 'Creating Account...' : 'Complete Sign Up'}
                    <ArrowRight className="h-4 w-4" />
                  </Button>

                  <div className="text-center pt-2">
                    <p className="text-xs text-slate-500">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => switchMode('signin')}
                        className="text-primary font-bold hover:underline"
                      >
                        Sign in here
                      </button>
                    </p>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Preserved Admin Safety Access */}
            <div className="pt-2 border-t border-slate-100">
              {!showAdminAccess ? (
                <button
                  type="button"
                  onClick={() => setShowAdminAccess(true)}
                  className="text-xs text-slate-500 hover:text-primary font-medium flex items-center justify-center mx-auto gap-1"
                >
                  <ShieldCheck className="h-3.5 w-3.5" /> Administrative Safety Access
                </button>
              ) : (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  onSubmit={handleAdminSignIn}
                  className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-primary" /> Admin Bypass Console
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAdminAccess(false);
                        setAdminError(null);
                      }}
                      className="text-xs text-slate-400 hover:text-slate-600"
                    >
                      Close
                    </button>
                  </div>

                  <AnimatePresence>
                    {adminError && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        role="alert"
                        className="bg-rose-50 border border-rose-200 rounded-lg p-2.5 text-xs text-rose-800 flex items-start justify-between gap-2"
                      >
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-rose-600 mt-0.5 shrink-0" />
                          <span className="font-semibold leading-tight">{adminError}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setAdminError(null)}
                          className="text-rose-400 hover:text-rose-700 p-0.5"
                          aria-label="Dismiss error"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => {
                      setAdminEmail(e.target.value);
                      if (adminError) setAdminError(null);
                    }}
                    placeholder="admin@prayercloud.org"
                    className={`h-10 text-xs bg-white ${adminError ? 'border-rose-300 focus-visible:ring-rose-500' : ''}`}
                    required
                  />
                  <Input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => {
                      setAdminPassword(e.target.value);
                      if (adminError) setAdminError(null);
                    }}
                    placeholder="Enter Administrative Security Key"
                    className={`h-10 text-xs bg-white ${adminError ? 'border-rose-300 focus-visible:ring-rose-500' : ''}`}
                    required
                  />
                  <Button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full h-9 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white"
                  >
                    Authenticate As Administrator
                  </Button>
                </motion.form>
              )}
            </div>

            {/* Security Badge */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Lock className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Bank-Grade Global Encryption</p>
                <p className="text-[11px] text-slate-500">
                  All field reports, intercessions, and missionary credentials encrypted in transit and at rest.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
