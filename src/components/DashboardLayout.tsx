import { ReactNode, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { GraduationCap, Bell, LogOut, ChevronLeft, ChevronRight, LucideIcon } from 'lucide-react';

interface NavItem {
  label: string;
  icon: LucideIcon;
  path?: string;
  onClick?: () => void;
}

interface DashboardLayoutProps {
  children: ReactNode;
  navItems: NavItem[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  pageTitle: string;
  breadcrumbs?: { label: string; path?: string }[];
}

export default function DashboardLayout({ children, navItems, activeTab, onTabChange, pageTitle, breadcrumbs }: DashboardLayoutProps) {
  const { user, center, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user || !center) return null;

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className={`${collapsed ? 'w-16' : 'w-64'} bg-gradient-navy flex flex-col transition-all duration-300 fixed inset-y-0 left-0 z-30`}>
        {/* Logo */}
        <div className={`p-4 border-b border-sidebar-border flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="w-9 h-9 rounded-lg bg-secondary flex-shrink-0 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-secondary-foreground" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-sidebar-primary-foreground truncate">EduCore</h2>
              <p className="text-[10px] text-sidebar-foreground/60 truncate">{center.name}</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => {
            const isActive = activeTab === item.label;
            return (
              <button
                key={item.label}
                onClick={() => {
                  if (item.onClick) item.onClick();
                  else if (item.path) navigate(item.path);
                  else onTabChange(item.label);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                } ${collapsed ? 'justify-center' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="w-4.5 h-4.5 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* User section */}
        <div className={`p-3 border-t border-sidebar-border ${collapsed ? 'flex flex-col items-center gap-2' : ''}`}>
          {!collapsed && (
            <div className="flex items-center gap-3 mb-3 px-2">
              <div className="w-9 h-9 rounded-full bg-sidebar-accent flex items-center justify-center text-xs font-bold text-sidebar-accent-foreground flex-shrink-0">
                {user.avatar}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-sidebar-primary-foreground truncate">{user.name}</p>
                <p className="text-[10px] text-sidebar-foreground/50 capitalize">{user.role}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition ${collapsed ? 'justify-center' : ''}`}
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border border-border shadow-card flex items-center justify-center text-muted-foreground hover:text-foreground transition"
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </aside>

      {/* Main */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Top bar */}
        <header className="h-14 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-20">
          <div className="flex items-center gap-2 text-sm">
            {breadcrumbs ? (
              breadcrumbs.map((bc, i) => (
                <span key={i} className="flex items-center gap-2">
                  {i > 0 && <span className="text-muted-foreground">/</span>}
                  {bc.path ? (
                    <Link to={bc.path} className="text-muted-foreground hover:text-foreground transition">{bc.label}</Link>
                  ) : (
                    <span className="font-semibold text-foreground">{bc.label}</span>
                  )}
                </span>
              ))
            ) : (
              <h1 className="font-semibold text-foreground">{pageTitle}</h1>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-lg hover:bg-muted transition">
              <Bell className="w-4.5 h-4.5 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                {user.avatar}
              </div>
              <span className="text-sm font-medium text-foreground hidden sm:block">{user.name}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
