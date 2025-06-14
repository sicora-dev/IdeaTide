import { Lightbulb, Target, Users } from 'lucide-react';
import { FeatureCard } from './FeatureCard';

export function FeaturesSection() {
  const features = [
    {
      icon: Lightbulb,
      title: 'Quick capture',
      description: 'Save your ideas instantly from any device. Never lose an inspiration again.',
      gradient: 'from-blue-50 to-indigo-50',
      border: 'border-blue-100',
      iconGradient: 'from-blue-600 to-purple-600'
    },
    {
      icon: Target,
      title: 'Smart organization',
      description: 'Categorize and structure your ideas automatically with AI to find them easily.',
      gradient: 'from-purple-50 to-pink-50',
      border: 'border-purple-100',
      iconGradient: 'from-purple-600 to-pink-600'
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'Share and develop ideas as a team. Creativity is better when shared.',
      gradient: 'from-green-50 to-emerald-50',
      border: 'border-green-100',
      iconGradient: 'from-green-600 to-emerald-600'
    }
  ];

  return (
    <section id="features" className="px-6 py-20 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Everything you need to manage your ideas
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Powerful and easy-to-use tools to take your ideas from concept to reality.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}