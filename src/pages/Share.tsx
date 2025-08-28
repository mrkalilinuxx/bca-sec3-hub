import { useState } from 'react';
import { Copy, Share2, Download, ExternalLink, Users, Eye, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const Share = () => {
  const { isAuthenticated } = useAuth();
  const { subjectFiles, schedule, timeSlots } = useData();
  const { toast } = useToast();
  
  const [customMessage, setCustomMessage] = useState('');

  const baseUrl = window.location.origin;
  const viewOnlyUrl = `${baseUrl}?view=true`;
  const routineUrl = `${baseUrl}/routine?view=true`;
  const subjectsUrl = `${baseUrl}/subjects?view=true`;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: `${label} link has been copied.`,
    });
  };

  const generateSharableText = () => {
    const totalFiles = subjectFiles.length;
    const totalScheduleItems = Object.keys(schedule).length;
    
    return `
🎓 BCA Section 3 - Academic Resources

📅 Schedule: ${totalScheduleItems} classes scheduled across ${timeSlots.length} time slots
📚 Files: ${totalFiles} study materials available for download

${customMessage ? `📝 Message: ${customMessage}\n` : ''}
🔗 Access: ${viewOnlyUrl}

${isAuthenticated ? '🔒 View-only access - No editing permissions' : ''}
    `.trim();
  };

  const shareViaWebAPI = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'BCA Section 3 - Academic Resources',
          text: generateSharableText(),
          url: viewOnlyUrl,
        });
        toast({
          title: "Shared Successfully",
          description: "Content shared via system share menu.",
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback to copying
      copyToClipboard(generateSharableText(), 'Shareable content');
    }
  };

  const downloadScheduleData = () => {
    const data = {
      schedule,
      timeSlots,
      exportDate: new Date().toISOString(),
      type: 'BCA_Section3_Schedule'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bca_sec3_schedule_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Schedule Downloaded",
      description: "Schedule data exported successfully.",
    });
  };

  const stats = {
    totalFiles: subjectFiles.length,
    totalScheduleItems: Object.keys(schedule).length,
    timeSlots: timeSlots.length,
    totalSize: subjectFiles.reduce((sum, file) => sum + file.size, 0)
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <div className="flex-1 max-w-4xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Share & Export</h1>
          <p className="text-muted-foreground">Share your content and export data for backup</p>
        </div>

        <Tabs defaultValue="share" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="share" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Share Access
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Data
            </TabsTrigger>
          </TabsList>

          <TabsContent value="share" className="space-y-6">
            {/* Statistics */}
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-gradient-card border-border">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{stats.totalScheduleItems}</div>
                  <div className="text-sm text-muted-foreground">Schedule Items</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-card border-border">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-accent">{stats.totalFiles}</div>
                  <div className="text-sm text-muted-foreground">Files</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-card border-border">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-success">{stats.timeSlots}</div>
                  <div className="text-sm text-muted-foreground">Time Slots</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-card border-border">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-warning">{formatFileSize(stats.totalSize)}</div>
                  <div className="text-sm text-muted-foreground">Total Size</div>
                </CardContent>
              </Card>
            </div>

            {/* Share Links */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gradient-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-primary" />
                    Full Access
                  </CardTitle>
                  <CardDescription>
                    Complete view of routine and files
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={viewOnlyUrl}
                      readOnly
                      className="font-mono text-sm bg-muted"
                    />
                    <Button
                      size="sm"
                      onClick={() => copyToClipboard(viewOnlyUrl, 'Full access')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-accent" />
                    Quick Share
                  </CardTitle>
                  <CardDescription>
                    Share via system share menu
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={shareViaWebAPI}
                    className="w-full bg-gradient-primary hover:bg-gradient-hover"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Now
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Custom Message */}
            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <CardTitle>Custom Share Message</CardTitle>
                <CardDescription>
                  Add a personal message when sharing (optional)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Add a custom message for recipients..."
                  className="w-full p-3 border border-border rounded-md bg-background text-foreground resize-none"
                  rows={3}
                />
                <div className="bg-muted p-3 rounded-md">
                  <p className="text-sm font-medium mb-2">Preview:</p>
                  <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono">
                    {generateSharableText()}
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* Page-Specific Links */}
            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <CardTitle>Specific Page Links</CardTitle>
                <CardDescription>
                  Direct links to specific sections
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Input
                    value={routineUrl}
                    readOnly
                    className="font-mono text-sm bg-muted"
                  />
                  <Button
                    size="sm"
                    onClick={() => copyToClipboard(routineUrl, 'Routine page')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(routineUrl, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    value={subjectsUrl}
                    readOnly
                    className="font-mono text-sm bg-muted"
                  />
                  <Button
                    size="sm"
                    onClick={() => copyToClipboard(subjectsUrl, 'Subjects page')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(subjectsUrl, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="export" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gradient-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5 text-primary" />
                    Schedule Data
                  </CardTitle>
                  <CardDescription>
                    Export routine and time slot data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={downloadScheduleData}
                    disabled={!isAuthenticated}
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download JSON
                  </Button>
                  {!isAuthenticated && (
                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                      <Lock className="h-3 w-3" />
                      Authentication required
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Share2 className="h-5 w-5 text-accent" />
                    Backup Info
                  </CardTitle>
                  <CardDescription>
                    Important backup information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• Files are stored locally in browser</p>
                    <p>• Schedule data can be exported as JSON</p>
                    <p>• Share links provide view-only access</p>
                    <p>• Regular backups recommended</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Share;