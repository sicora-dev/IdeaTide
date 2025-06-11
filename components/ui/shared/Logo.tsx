import Image from 'next/image';

interface LogoProps {
  variant?: 'icon' | 'horizontal' | 'full';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  width?: number;
  height?: number;
  className?: string;
}

export function Logo({ variant = 'icon', size = 'md', width, height, className = '' }: LogoProps) {
  const sizes = {
    sm: { width: 24, height: 24 },
    md: { width: 32, height: 32 },
    lg: { width: 48, height: 48 },
    xl: { width: 60, height: 60 },
    xxl: { width: 80, height: 80 }
  };

  const logoSrc = {
    icon: '/logos/IdeaTide-ico.png',
    horizontal: '/logos/IdeaTide-horizontal.png',
    full: '/logos/IdeaTide-lstacked.png'
  };

  return (
    <Image
      src={logoSrc[variant]}
      alt="IdeaTide Logo"
      width={width ? width : sizes[size].width}
      height={height ? height : sizes[size].height}
      className={`object-contain ${className}`}
      priority
    />
  );
}