import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { StatsGrid } from './StatsGrid';

export function HeroSection() {
  return (
    <section className="px-6 py-20 max-w-7xl mx-auto text-center">
      <div className="max-w-4xl mx-auto">   
        <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
          Organize and develop
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> your ideas </span>
          like never before
        </h1>
        
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          IdeaTide is the smart idea manager that helps you capture, organize and bring your most creative thoughts to life with the power of modern technology.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link href="/dashboard">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 text-lg">
              Try for free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>

        <StatsGrid />
      </div>
    </section>
  );
}