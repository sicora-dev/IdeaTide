import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function CTASection() {
  return (
    <section className="px-6 py-20 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          Ready to revolutionize your ideas?
        </h2>
        <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
          Join thousands of creators who are already using IdeaTide to bring their best ideas to life.
        </p>
        <Link href="/dashboard">
          <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold">
            Start now for free
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
      </div>
    </section>
  );
}