import { Link, useLocation } from 'react-router-dom';
import { Calendar, BookOpen, Share, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const Navigation = () => {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Settings },
    { path: '/routine', label: 'Routine', icon: Calendar },
    { path: '/subjects', label: 'Subjects', icon: BookOpen },
    { path: '/share', label: 'Share', icon: Share },
  ];

  return (
    <nav className="bg-card border-b border-border px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent mr-8">
            BCA SEC 3
          </h1>
          
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button
                variant={location.pathname === item.path ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "flex items-center gap-2",
                  location.pathname === item.path && "bg-primary hover:bg-primary-hover"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Button>
            </Link>
          ))}
        </div>

        {isAuthenticated && (
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Navigation;