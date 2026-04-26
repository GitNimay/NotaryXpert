import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Gavel, Loader2, Lock } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else {
        setError(err.message || 'Failed to log in. Check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-primary mb-6">
          <Gavel size={64} className="drop-shadow-[0_0_15px_rgba(0,99,156,0.5)]" />
        </div>
        <h2 className="mt-6 text-center font-headline text-4xl font-bold text-on-surface tracking-tight">
          NotaryXpert Access
        </h2>
        <p className="mt-2 text-center font-body text-sm text-on-surface-variant max-w">
          Enter your authorized credentials to access the secure portal.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-surface-container-lowest py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-outline-variant/15 editorial-shadow relative overflow-hidden">
          
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-label font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-container-highest border border-outline-variant/20 focus:border-primary/50 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 rounded-lg font-body text-on-surface px-4 py-3 transition-all outline-none"
                  placeholder="admin@notaryxpert.local"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-label font-bold text-on-surface-variant uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Password</span>
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface-container-highest border border-outline-variant/20 focus:border-primary/50 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 rounded-lg font-body text-on-surface px-4 py-3 transition-all outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-lg text-sm font-body">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm font-label font-bold text-sm text-white gradient-primary hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 tracking-wider uppercase items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Lock size={18} />
                    Unlock Portal
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
