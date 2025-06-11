"use client"
import { Suspense } from 'react'
import ErrorComponent from './error';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Lightbulb, Zap, Target, Users, CheckCircle, Star } from 'lucide-react';
import Image from 'next/image';
import { Logo } from '@/components/ui/shared/Logo';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <div className=" flex items-center justify-center">
            <Logo variant='horizontal' width={100}/>
          </div>
          
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <Link href="#features" className="text-slate-600 hover:text-slate-900 transition-colors">
            Características
          </Link>
          <Link href="#pricing" className="text-slate-600 hover:text-slate-900 transition-colors">
            Precios
          </Link>
          <Link href="#about" className="text-slate-600 hover:text-slate-900 transition-colors">
            Acerca de
          </Link>
        </div>
        <Link href="/dashboard">
          <Button variant="default" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            Comenzar
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20 max-w-7xl mx-auto text-center">
        <div className="max-w-4xl mx-auto">   
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
            Organiza y desarrolla
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> tus ideas </span>
            como nunca antes
          </h1>
          
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            IdeaTide es el gestor de ideas inteligente que te ayuda a capturar, organizar y dar vida a tus pensamientos más creativos con el poder de la tecnología moderna.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 text-lg">
                Probar gratis
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">10k+</div>
              <div className="text-sm text-slate-600">Ideas creadas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">95%</div>
              <div className="text-sm text-slate-600">Satisfacción</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">24/7</div>
              <div className="text-sm text-slate-600">Disponible</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Todo lo que necesitas para gestionar tus ideas
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Herramientas poderosas y fáciles de usar para llevar tus ideas del concepto a la realidad.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Captura rápida</h3>
              <p className="text-slate-600 leading-relaxed">
                Guarda tus ideas al instante desde cualquier dispositivo. Nunca pierdas una inspiración.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Organización inteligente</h3>
              <p className="text-slate-600 leading-relaxed">
                Categoriza y estructura tus ideas automáticamente con IA para encontrarlas fácilmente.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Colaboración</h3>
              <p className="text-slate-600 leading-relaxed">
                Comparte y desarrolla ideas en equipo. La creatividad es mejor cuando se comparte.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            ¿Listo para revolucionar tus ideas?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Únete a miles de creadores que ya están usando IdeaTide para dar vida a sus mejores ideas.
          </p>
          <Link href="/dashboard">
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold">
              Comenzar ahora gratis
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="flex items-center justify-center">
                <Logo variant='horizontal' width={100}/>
              </div>
            </div>
            <div className="flex space-x-8 text-sm text-slate-400">
              <Link href="#" className="hover:text-white transition-colors">Privacidad</Link>
              <Link href="#" className="hover:text-white transition-colors">Términos</Link>
              <Link href="#" className="hover:text-white transition-colors">Soporte</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800 text-center text-slate-400 text-sm">
            © 2025 IdeaTide. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}