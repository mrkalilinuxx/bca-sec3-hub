import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Calendar, BookOpen, Share, Lock, Unlock, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';

const Dashboard = () => {
  const [password, setPassword] = useState('');
  const { isAuthenticated, authenticate } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const viewOnly = searchParams.get('view') === 'true';

  const handleAuth = () => {
    if (authenticate(password)) {
      toast({
        title: "Authentication Successful",
        description: "You now have editing access to all features.",
      });
      setPassword('');
    } else {
      toast({
        title: "Authentication Failed", 
        description: "Incorrect password. Please try again.",
        variant: "destructive",
      });
    }
  };

  const copyViewLink = () => {
    const viewLink = `${window.location.origin}?view=true`;
    navigator.clipboard.writeText(viewLink);
    toast({
      title: "Link Copied",
      description: "View-only link copied to clipboard.",
    });
  };

  const features = [
    {
      title: 'Weekly Routine',
      description: 'Manage your class schedule with editable time slots',
      icon: Calendar,
      path: '/routine',
      color: 'from-blue-500 to-purple-600'
    },
    {
      title: 'Subject Files',
      description: 'Upload and organize files for 10 subjects',
      icon: BookOpen,
      path: '/subjects',
      color: 'from-green-500 to-blue-500'
    },
    {
      title: 'Share & Download',
      description: 'Share view-only access and download files',
      icon: Share,
      path: '/share',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            BCA Section 3 Management
          </h1>
          <p className="text-muted-foreground text-lg">
            Professional routine and subject file management system
          </p>
        </div>

        {!isAuthenticated && !viewOnly && (
          <Card className="mb-8 bg-gradient-card border-border shadow-professional">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Administrative Access
              </CardTitle>
              <CardDescription>
                Enter the admin password to unlock editing capabilities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
                  className="bg-input border-border"
                />
                <Button onClick={handleAuth} className="bg-primary hover:bg-primary-hover">
                  <Unlock className="h-4 w-4 mr-2" />
                  Unlock
                </Button>
              </div>
              
              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">View-Only Access:</span>
                  <Button variant="outline" size="sm" onClick={copyViewLink}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Link
                  </Button>
                </div>
                <code className="text-xs text-muted-foreground break-all">
                  {window.location.origin}?view=true
                </code>
              </div>
            </CardContent>
          </Card>
        )}

        {(isAuthenticated || viewOnly) && (
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-full text-sm font-medium">
              <Unlock className="h-4 w-4" />
              {viewOnly ? 'View-Only Access' : 'Full Administrative Access'}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Link key={index} to={feature.path}>
              <Card className="h-full bg-gradient-card border-border hover:shadow-glow transition-all duration-300 group cursor-pointer">
                <CardHeader>
                  <div className={`h-12 w-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                  <CardDescription>
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground text-sm">
            Built for Bachelor of Computer Applications - Section 3
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;