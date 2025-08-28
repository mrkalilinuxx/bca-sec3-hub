import { Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">R</span>
            </div>
            <span className="text-sm text-muted-foreground">
              Routine Management System
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>© 2024 Developed by</span>
            <span className="font-medium text-foreground">Danzer</span>
            <Mail className="h-4 w-4" />
            <a 
              href="mailto:rajdeepgupta010101@gmail.com"
              className="text-primary hover:text-primary-hover transition-colors"
            >
              rajdeepgupta010101@gmail.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;