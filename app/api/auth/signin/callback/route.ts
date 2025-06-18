import { insertUser } from '@/lib/actions/user';
import { getUserData } from '@/lib/db/queries';
import { createClient } from 'libs/supabase/server/server'
import { NextResponse } from 'next/server'

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/'

    // Validar que existe el código de autorización
    if (!code) {
      console.error('No authorization code provided')
      return NextResponse.redirect(`${origin}/signin?error=missing_code`)
    }

    const supabase = await createClient()
    
    // Intercambiar código por sesión
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Error exchanging code for session:', error)
      return NextResponse.redirect(`${origin}/signin?error=exchange_failed`)
    }

    if (!data?.user) {
      console.error('No user data returned from session exchange')
      return NextResponse.redirect(`${origin}/signin?error=no_user_data`)
    }

    // Verificar si el usuario ya existe en la base de datos
    const userExists = await getUserData(data.user.id)
    
    // Si el usuario no existe, crearlo
    if (!userExists) {
      try {
        await insertUser({
          id: data.user.id,
          email: data.user.email || '',
          full_name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || '',
          image: data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture || '',
          phone: data.user.user_metadata?.phone || ''
        })
        console.log('New user created successfully:', data.user.id)
      } catch (insertError) {
        console.error('Error inserting user:', insertError)
        return NextResponse.redirect(`${origin}/signin?error=user_creation_failed`)
      }
    } else {
      console.log('User already exists:', data.user.id)
    }

    // Redirigir al usuario a su destino
    return NextResponse.redirect(`${origin}${next}`)
    
  } catch (error) {
    console.error('Unexpected error in auth callback:', error)
    return NextResponse.redirect(`${origin}/signin?error=unexpected_error`)
  }
}