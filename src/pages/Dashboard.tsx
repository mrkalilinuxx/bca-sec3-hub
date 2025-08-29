import { Calendar, FileText, Share, BookOpen, Clock, Users, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Logo from '@/components/Logo';
import EditableContent from '@/components/EditableContent';
import FileUpload from '@/components/FileUpload';
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
          <div className="max-w-2xl mx-auto">
            <EditableContent 
              section="dashboard_description"
              defaultContent="Organize your class schedules, manage subject files, and share your routine with classmates. Everything is stored securely in the cloud for real-time collaboration."
              type="textarea"
              className="text-muted-foreground text-center"
              placeholder="Enter dashboard description..."
            />
          </div>
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

        {/* File Upload Section */}
        <div className="mb-8">
          <FileUpload />
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-card border-border shadow-professional hover:shadow-elegant transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <EditableContent 
                  section="routine_card_title"
                  defaultContent="Weekly Routine"
                  placeholder="Card title..."
                />
              </CardTitle>
              <CardDescription>
                <EditableContent 
                  section="routine_card_description"
                  defaultContent="View and edit your class schedule for the week"
                  placeholder="Card description..."
                />
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
                <EditableContent 
                  section="files_card_title"
                  defaultContent="Subject Files"
                  placeholder="Card title..."
                />
              </CardTitle>
              <CardDescription>
                <EditableContent 
                  section="files_card_description"
                  defaultContent="Upload and organize files for each subject"
                  placeholder="Card description..."
                />
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
                <EditableContent 
                  section="analytics_card_title"
                  defaultContent="Analytics"
                  placeholder="Card title..."
                />
              </CardTitle>
              <CardDescription>
                <EditableContent 
                  section="analytics_card_description"
                  defaultContent="View insights and analytics for subjects"
                  placeholder="Card description..."
                />
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
                <EditableContent 
                  section="share_card_title"
                  defaultContent="Share & Export"
                  placeholder="Card title..."
                />
              </CardTitle>
              <CardDescription>
                <EditableContent 
                  section="share_card_description"
                  defaultContent="Share your routine or export data"
                  placeholder="Card description..."
                />
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
            <EditableContent 
              section="auth_notice"
              defaultContent="🔒 To edit content and upload files, please log in with your admin credentials using the login button in the top navigation."
              type="textarea"
              className="text-muted-foreground"
              placeholder="Authentication notice..."
            />
          </Card>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;