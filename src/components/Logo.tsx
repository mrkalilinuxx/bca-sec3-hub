import { Calendar } from 'lucide-react';

interface LogoProps {
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Logo = ({ showText = true, size = 'md' }: LogoProps) => {
  const sizes = {
    sm: { icon: 'h-6 w-6', text: 'text-sm', container: 'h-8 w-8' },
    md: { icon: 'h-5 w-5', text: 'text-base', container: 'h-10 w-10' },
    lg: { icon: 'h-8 w-8', text: 'text-xl', container: 'h-16 w-16' }
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`${sizes[size].container} bg-gradient-primary rounded-xl flex items-center justify-center shadow-elegant`}>
        <Calendar className={`${sizes[size].icon} text-white`} />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`${sizes[size].text} font-bold text-foreground`}>
            Routine Manager
          </span>
          <span className="text-xs text-muted-foreground">
            BCA Section 3
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;