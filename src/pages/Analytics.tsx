import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SubjectAnalytics from '@/components/SubjectAnalytics';

const Analytics = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <div className="flex-1 max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Subject Analytics</h1>
          <p className="text-muted-foreground">Analyze your subjects, files, and schedule data</p>
        </div>

        <SubjectAnalytics />
      </div>
      
      <Footer />
    </div>
  );
};

export default Analytics;