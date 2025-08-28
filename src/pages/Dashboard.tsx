import { Calendar, FileText, Share, BookOpen, Clock, Users, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Logo from '@/components/Logo';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  const { schedule, subjectFiles, timeSlots, subjects } = useData();

  const totalClasses = Object.keys(schedule).length;
  const totalFiles = subjectFiles.length;
  const totalTimeSlots = timeSlots.length;
  const totalSubjects = subjects.length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <div className="flex-1 max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Logo size="lg" />
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Organize your class schedules, manage subject files, and share your routine with classmates. 
            Everything is stored locally in your browser for privacy and convenience.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-card border-border shadow-professional">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Subjects</p>
                  <p className="text-2xl font-bold">{totalSubjects}</p>
                </div>
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border shadow-professional">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Files</p>
                  <p className="text-2xl font-bold">{totalFiles}</p>
                </div>
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border shadow-professional">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Scheduled Classes</p>
                  <p className="text-2xl font-bold">{totalClasses}</p>
                </div>
                <Clock className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border shadow-professional">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Time Slots</p>
                  <p className="text-2xl font-bold">{totalTimeSlots}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-card border-border shadow-professional hover:shadow-elegant transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Weekly Routine
              </CardTitle>
              <CardDescription>
                View and edit your class schedule for the week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/routine">
                <Button className="w-full">
                  Manage Routine
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border shadow-professional hover:shadow-elegant transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Subject Files
              </CardTitle>
              <CardDescription>
                Upload and organize files for each subject
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/subjects">
                <Button className="w-full">
                  Manage Files
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border shadow-professional hover:shadow-elegant transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Analytics
              </CardTitle>
              <CardDescription>
                View insights and analytics for subjects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/analytics">
                <Button className="w-full">
                  View Analytics
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border shadow-professional hover:shadow-elegant transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share className="h-5 w-5 text-primary" />
                Share & Export
              </CardTitle>
              <CardDescription>
                Share your routine or export as PDF
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/share">
                <Button className="w-full">
                  Share Routine
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {!isAuthenticated && (
          <Card className="bg-muted/50 border-border text-center p-6">
            <p className="text-muted-foreground">
              🔒 To edit the routine and upload files, please authenticate using the admin password: <strong>ssladmin</strong>
            </p>
          </Card>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;