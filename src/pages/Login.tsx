import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getCredentials } from '@/data/mockData';
import { GraduationCap, Eye, EyeOff, LogIn, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const roles = ['admin', 'moderator', 'teacher'] as const;
const roleLabels = { admin: 'Institution Admin', moderator: 'Moderator', teacher: 'Teacher' };

export default function Login() {
  const [role, setRole] = useState<typeof roles[number]>('admin');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  const creds = getCredentials('alnour', role);
  const [username, setUsername] = useState(creds.username);
  const [password, setPassword] = useState(creds.password);

  const handleRoleChange = (newRole: typeof roles[number]) => {
    setRole(newRole);
    const c = getCredentials('alnour', newRole);
    setUsername(c.username);
    setPassword(c.password);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast({ title: 'Error', description: 'Please fill in all fields', variant: 'destructive' });
      return;
    }
    const success = login(username, password);
    if (success) {
      toast({ title: 'Welcome!', description: `Logged in as ${roleLabels[role]}` });
      navigate(`/${role === 'admin' ? 'admin' : role}`);
    } else {
      toast({ title: 'Login Failed', description: 'Invalid credentials', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-navy p-4 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-secondary blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-secondary blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-secondary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-primary-foreground">EduCore</h1>
          </div>
          <p className="text-primary-foreground/60 text-sm">Educational Platform Management System</p>
        </div>

        {/* Login Card */}
        <div className="bg-card rounded-2xl shadow-login p-7">
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Role Selector */}
            <div>
              <label className="block text-sm font-semibold text-card-foreground mb-1.5">Select Your Role</label>
              <div className="flex gap-1.5 bg-muted rounded-lg p-1">
                {roles.map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleRoleChange(r)}
                    className={`flex-1 py-2 px-2 rounded-md text-xs font-semibold transition-all ${
                      role === r
                        ? 'bg-secondary text-secondary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {roleLabels[r]}
                  </button>
                ))}
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-card-foreground mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition"
                placeholder="Enter username"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-card-foreground mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 pr-10 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-secondary text-secondary-foreground font-semibold text-sm hover:opacity-90 transition flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Login
            </button>
          </form>
        </div>

        {/* Demo Credentials */}
        <div className="mt-5 bg-card/10 backdrop-blur-sm border border-primary-foreground/10 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-primary-foreground/70" />
            <span className="text-sm font-semibold text-primary-foreground/90">Demo Credentials</span>
          </div>
          <div className="bg-card/10 rounded-lg p-3">
            <p className="text-primary-foreground/60 text-xs mb-1">
              <span className="font-medium text-primary-foreground/80">Al-Nour Educational Center</span> — {roleLabels[role]}
            </p>
            <p className="text-primary-foreground/90 text-sm font-mono">
              {creds.username} / {creds.password}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
