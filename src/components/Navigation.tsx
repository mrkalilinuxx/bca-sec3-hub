import { Calendar, FileText, Share, Home, Lock, Unlock, BarChart3 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminLogin from './AdminLogin';
import Logo from './Logo';

const Navigation = () => {
  const location = useLocation();
  const { isAuthenticated, logout, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/routine', label: 'Routine', icon: Calendar },
    { path: '/subjects', label: 'Subjects', icon: FileText },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/share', label: 'Share', icon: Share },
  ];

  if (loading) {
    return (
      <nav className="bg-card border-b border-border px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <div className="text-sm text-muted-foreground">Loading...</div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className="bg-card border-b border-border px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/">
            <Logo size="sm" />
          </Link>
          
          <div className="flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={location.pathname === item.path ? "default" : "ghost"}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <item.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Button>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Unlock className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLogin(true)}
              >
                <Lock className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Admin Login</span>
              </Button>
            )}
          </div>
        </div>
      </nav>
      
      <AdminLogin open={showLogin} onOpenChange={setShowLogin} />
    </>
  );
};

export default Navigation;