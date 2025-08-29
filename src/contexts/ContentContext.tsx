import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, ContentRow } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface ContentContextType {
  content: Record<string, string>;
  updateContent: (section: string, newContent: string) => Promise<void>;
  loading: boolean;
}

const ContentContext = createContext<ContentContextType | null>(null);

export const ContentProvider = ({ children }: { children: ReactNode }) => {
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadContent();
    
    // Subscribe to real-time changes
    const subscription = supabase
      .channel('content_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'content' },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const newData = payload.new as ContentRow;
            setContent(prev => ({
              ...prev,
              [newData.section]: newData.content
            }));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadContent = async () => {
    try {
      const { data, error } = await supabase
        .from('content')
        .select('*');

      if (error) {
        console.error('Error loading content:', error);
        return;
      }

      const contentMap: Record<string, string> = {};
      data?.forEach((item: ContentRow) => {
        contentMap[item.section] = item.content;
      });
      
      setContent(contentMap);
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateContent = async (section: string, newContent: string) => {
    try {
      const { error } = await supabase
        .from('content')
        .upsert({
          section,
          content: newContent,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'section'
        });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to save changes",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Changes saved successfully",
      });
    } catch (error) {
      console.error('Error updating content:', error);
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive",
      });
    }
  };

  return (
    <ContentContext.Provider value={{ content, updateContent, loading }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within ContentProvider');
  }
  return context;
};