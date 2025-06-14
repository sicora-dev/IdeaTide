import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

interface AuthCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-3xl font-bold text-slate-900">
          {title}
        </CardTitle>
        <CardDescription className="text-slate-600 text-base">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {children}
      </CardContent>
    </Card>
  );
}