import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import { ContentProvider } from "@/contexts/ContentContext";
import { FileProvider } from "@/contexts/FileContext";
import Dashboard from "./pages/Dashboard";
import Routine from "./pages/Routine";
import Subjects from "./pages/Subjects";
import Analytics from "./pages/Analytics";
import Share from "./pages/Share";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DataProvider>
        <ContentProvider>
          <FileProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/routine" element={<Routine />} />
                  <Route path="/subjects" element={<Subjects />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/share" element={<Share />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </FileProvider>
        </ContentProvider>
      </DataProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;