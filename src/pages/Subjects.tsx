import { useState, useRef } from 'react';
import { Upload, Download, Trash2, File, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';

const SUBJECTS = [
  'Data Structures & Algorithms',
  'Database Management Systems',
  'Object Oriented Programming',
  'Computer Networks',
  'Operating Systems',
  'Software Engineering',
  'Web Technologies',
  'Mathematics for Computing',
  'Computer Graphics',
  'Project Work'
];

const Subjects = () => {
  const { isAuthenticated } = useAuth();
  const { subjectFiles, addSubjectFile, removeSubjectFile } = useData();
  const { toast } = useToast();
  
  const [selectedSubject, setSelectedSubject] = useState('');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (files: FileList | null) => {
    if (!files || !selectedSubject || !isAuthenticated) return;

    Array.from(files).forEach(file => {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File Too Large",
          description: `${file.name} exceeds 10MB limit.`,
          variant: "destructive",
        });
        return;
      }

      addSubjectFile(selectedSubject, file);
      toast({
        title: "File Uploaded",
        description: `${file.name} uploaded successfully.`,
      });
    });

    setUploadDialogOpen(false);
    setSelectedSubject('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownload = (file: any) => {
    // Create a blob URL and trigger download
    const url = URL.createObjectURL(file.file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download Started",
      description: `Downloading ${file.file.name}`,
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('image')) return '🖼️';
    if (type.includes('video')) return '🎥';
    if (type.includes('audio')) return '🎵';
    if (type.includes('text')) return '📝';
    return '📎';
  };

  const getSubjectFiles = (subject: string) => {
    return subjectFiles.filter(file => file.name === subject);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Subject Files</h1>
            <p className="text-muted-foreground">Upload and manage files for each subject</p>
          </div>
          {isAuthenticated && (
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary-hover">
                  <Plus className="h-4 w-4 mr-2" />
                  Upload File
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload File</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Select Subject</label>
                    <select
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className="w-full p-2 border border-border rounded-md bg-background text-foreground"
                    >
                      <option value="">Choose a subject...</option>
                      {SUBJECTS.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Select Files</label>
                    <Input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      onChange={(e) => handleFileUpload(e.target.files)}
                      disabled={!selectedSubject}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary-hover"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Maximum file size: 10MB. Multiple files supported.
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SUBJECTS.map((subject, index) => {
            const files = getSubjectFiles(subject);
            
            return (
              <Card key={subject} className="bg-gradient-card border-border shadow-professional">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className={`h-8 w-8 rounded-lg bg-gradient-to-r from-blue-${500 + (index * 100) % 400} to-purple-${600 + (index * 50) % 300} flex items-center justify-center`}>
                      <span className="text-white text-sm font-bold">{subject.charAt(0)}</span>
                    </div>
                    <span className="truncate">{subject}</span>
                  </CardTitle>
                  <CardDescription>
                    {files.length} {files.length === 1 ? 'file' : 'files'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {files.length > 0 ? (
                    <div className="space-y-3">
                      {files.slice(0, 3).map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="text-lg">{getFileIcon(file.type)}</span>
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate">{file.file.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatFileSize(file.size)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDownload(file)}
                              className="h-8 w-8 p-0"
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                            {isAuthenticated && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  removeSubjectFile(file.id);
                                  toast({
                                    title: "File Deleted",
                                    description: `${file.file.name} has been removed.`,
                                  });
                                }}
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      {files.length > 3 && (
                        <div className="text-center pt-2">
                          <Button variant="ghost" size="sm" className="text-xs">
                            View all {files.length} files
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <File className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No files uploaded</p>
                      {isAuthenticated && (
                        <p className="text-xs">Click upload to add files</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            All files are stored locally in your browser. Share the view-only link to let others download files.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Subjects;