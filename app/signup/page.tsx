'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { createClient } from 'libs/supabase/client/client';
import { toast } from 'sonner';
import Link from 'next/link';
import { Logo } from '@/components/ui/shared/Logo';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (
    e: any,
    options: {
      type: string;
      provider?: 'google';
    }
  ) => {
    e?.preventDefault();
    setIsLoading(true);

    try {
      const { type, provider } = options;
      const redirectURL = window.location.origin + "/api/auth/signin/callback";

      if (type === "oauth") {
        if (!provider) throw new Error("OAuth provider is required");
        const { error } = await supabase.auth.signInWithOAuth({
          provider: provider,
          options: {
            redirectTo: redirectURL,
          },
        });
        if (error) throw error;
      } else if (type === "password") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });
        if (error) throw error;
        toast.success("¡Revisa tu email para confirmar tu cuenta!");
        router.replace("/signin");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Error al crear la cuenta.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex justify-center items-center p-8">
      <div className="w-full max-w-md space-y-1">
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <Logo variant='horizontal' width={140} />
          </Link>
        </div>

        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-bold text-slate-900">
              Crear cuenta
            </CardTitle>
            <CardDescription className="text-slate-600 text-base">
              Únete a IdeaTide y comienza a organizar tus ideas
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Sign Up Form */}
            <form onSubmit={(e) => handleSignup(e, { type: "password" })} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-slate-700 font-medium">
                  Nombre completo
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Tu nombre completo"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">
                  Correo electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 font-medium">
                  Contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  disabled={isLoading}
                  className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-base" 
                disabled={isLoading}
              >
                {isLoading ? "Creando cuenta..." : "Crear cuenta"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm uppercase">
                <span className="bg-white px-4 text-slate-500 font-medium">
                  O continúa con
                </span>
              </div>
            </div>

            {/* Google OAuth */}
            <Button 
              variant="outline" 
              className="w-full h-12 border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold"
              onClick={(e) => handleSignup(e, { type: "oauth", provider: "google" })}
              disabled={isLoading}
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {isLoading ? "Cargando..." : "Continuar con Google"}
            </Button>
          </CardContent>
          
          <CardFooter className="pt-4">
            <p className="text-center w-full text-slate-600">
              ¿Ya tienes una cuenta?{' '}
              <Link href="/signin" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                Iniciar sesión
              </Link>
            </p>
          </CardFooter>
        </Card>

        {/* Footer link */}
        <div className="text-center">
          <Link href="/" className="text-slate-500 hover:text-slate-700 text-sm">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}