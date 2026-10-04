import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Shield } from 'lucide-react';

export function Login() {
  const [operatorId, setOperatorId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operatorId, password })
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      // Store token and redirect
      localStorage.setItem('token', data.token);
      localStorage.setItem('operator', JSON.stringify(data.operator));
      
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-primary/30 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-accent/20 blur-[100px]" />
      </div>

      <div className="w-full max-w-md bg-surface border border-border rounded-[24px] shadow-2xl p-8 z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-text">ChromaSeal</h1>
          <p className="text-muted text-sm mt-1">Digital Field Evidence</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-muted mb-1.5" htmlFor="operatorId">
              Operator ID
            </label>
            <input
              id="operatorId"
              type="text"
              value={operatorId}
              onChange={(e) => setOperatorId(e.target.value)}
              className="w-full h-12 bg-surface-2 border border-border rounded-xl px-4 text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              placeholder="e.g. OP-102"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-1.5" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 bg-surface-2 border border-border rounded-xl px-4 text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl transition-all shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-border flex flex-col items-center gap-3">
          <div className="px-3 py-1.5 bg-surface-2 rounded-full border border-border/50 text-xs text-muted flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            DEMO MODE
          </div>
          <p className="text-xs text-muted text-center max-w-[260px]">
            Use <span className="font-mono bg-surface-2 px-1 py-0.5 rounded text-text">OP-102</span> / <span className="font-mono bg-surface-2 px-1 py-0.5 rounded text-text">demo1234</span>
          </p>
        </div>
      </div>
    </div>
  );
}
