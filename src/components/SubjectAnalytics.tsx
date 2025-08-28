import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { FileText, Clock, BookOpen, TrendingUp } from 'lucide-react';
import { useData } from '@/contexts/DataContext';

const SubjectAnalytics = () => {
  const { subjects, subjectFiles, schedule, timeSlots } = useData();

  // Calculate analytics data
  const getAnalyticsData = () => {
    const subjectStats = subjects.map(subject => {
      const filesCount = subjectFiles.filter(file => file.name === subject.name).length;
      const scheduledClasses = Object.values(schedule).filter(item => item.name === subject.name).length;
      const totalFileSize = subjectFiles
        .filter(file => file.name === subject.name)
        .reduce((total, file) => total + file.size, 0);

      return {
        name: subject.name,
        files: filesCount,
        classes: scheduledClasses,
        totalSize: totalFileSize,
        color: subject.color
      };
    });

    return subjectStats;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const analyticsData = getAnalyticsData();
  const totalFiles = subjectFiles.length;
  const totalClasses = Object.keys(schedule).length;
  const totalSubjects = subjects.length;
  const totalStorage = subjectFiles.reduce((total, file) => total + file.size, 0);

  const pieData = analyticsData.filter(item => item.files > 0).map(item => ({
    name: item.name.split(' ')[0], // Shortened name for better display
    value: item.files,
    fullName: item.name,
    color: item.color
  }));

  const barData = analyticsData.map(item => ({
    name: item.name.split(' ')[0], // Shortened name
    fullName: item.name,
    files: item.files,
    classes: item.classes
  }));

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card border-border">
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

        <Card className="bg-gradient-card border-border">
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

        <Card className="bg-gradient-card border-border">
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

        <Card className="bg-gradient-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Storage</p>
                <p className="text-2xl font-bold">{formatFileSize(totalStorage)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="files">File Distribution</TabsTrigger>
          <TabsTrigger value="details">Subject Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle>Files vs Classes Comparison</CardTitle>
              <CardDescription>
                Compare uploaded files and scheduled classes per subject
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(label) => {
                      const item = barData.find(d => d.name === label);
                      return item?.fullName || label;
                    }}
                  />
                  <Bar dataKey="files" fill="hsl(var(--primary))" name="Files" />
                  <Bar dataKey="classes" fill="hsl(var(--secondary))" name="Classes" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files" className="space-y-4">
          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle>File Distribution by Subject</CardTitle>
              <CardDescription>
                Distribution of uploaded files across subjects
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name, props) => [value, `${props.payload.fullName}: Files`]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  No files uploaded yet
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {analyticsData.map((subject) => (
              <Card key={subject.name} className="bg-gradient-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <div 
                      className="h-4 w-4 rounded-full"
                      style={{ backgroundColor: subject.color }}
                    />
                    <span className="truncate">{subject.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Files:</span>
                    <Badge variant="secondary">{subject.files}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Classes:</span>
                    <Badge variant="secondary">{subject.classes}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Storage:</span>
                    <Badge variant="outline">{formatFileSize(subject.totalSize)}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SubjectAnalytics;