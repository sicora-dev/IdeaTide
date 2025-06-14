import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
  border: string;
  iconGradient: string;
}

export function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  gradient, 
  border, 
  iconGradient 
}: FeatureCardProps) {
  return (
    <div className={`text-center p-8 rounded-2xl bg-gradient-to-br ${gradient} border ${border}`}>
      <div className={`w-12 h-12 bg-gradient-to-r ${iconGradient} rounded-xl flex items-center justify-center mx-auto mb-6`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-4">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}