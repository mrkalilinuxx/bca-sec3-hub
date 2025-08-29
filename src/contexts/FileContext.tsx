import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, FileRow } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface FileContextType {
  files: FileRow[];
  uploadFile: (file: File) => Promise<void>;
  deleteFile: (fileId: string) => Promise<void>;
  loading: boolean;
}

const FileContext = createContext<FileContextType | null>(null);

export const FileProvider = ({ children }: { children: ReactNode }) => {
  const [files, setFiles] = useState<FileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadFiles();
    
    // Subscribe to real-time changes
    const subscription = supabase
      .channel('files_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'files' },
        () => {
          loadFiles(); // Reload files when changes occur
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (error) {
        console.error('Error loading files:', error);
        return;
      }

      setFiles(data || []);
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File) => {
    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, file);

      if (uploadError) {
        toast({
          title: "Error",
          description: "Failed to upload file",
          variant: "destructive",
        });
        return;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);

      // Save file record to database
      const { error: dbError } = await supabase
        .from('files')
        .insert({
          file_url: publicUrl,
          file_name: file.name,
          uploaded_at: new Date().toISOString()
        });

      if (dbError) {
        toast({
          title: "Error",
          description: "Failed to save file record",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      });
    }
  };

  const deleteFile = async (fileId: string) => {
    try {
      const { error } = await supabase
        .from('files')
        .delete()
        .eq('id', fileId);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to delete file",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "File deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive",
      });
    }
  };

  return (
    <FileContext.Provider value={{ files, uploadFile, deleteFile, loading }}>
      {children}
    </FileContext.Provider>
  );
};

export const useFiles = () => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error('useFiles must be used within FileProvider');
  }
  return context;
};