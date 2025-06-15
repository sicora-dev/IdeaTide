import { Button } from '@/components/ui/button';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { getAuthenticatedUser } from 'libs/supabase/server/auth';
import { LogoutButton } from '../ui/dashboard/user-dropdown/LogoutButton';

export async function User() {
  try {
    const { user } = await getAuthenticatedUser();

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="overflow-hidden rounded-full"
          >
            <Image
              src={user?.image ?? '/placeholder-user.jpg'}
              width={36}
              height={36}
              alt="Avatar"
              className="overflow-hidden rounded-full"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            {user.full_name || 'My Account'}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link href="/dashboard/profile">
            <DropdownMenuItem className='cursor-pointer w-full'>Settings</DropdownMenuItem>
          </Link>
          <Link href="/support">
            <DropdownMenuItem className='cursor-pointer w-full'>Support</DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogoutButton />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  } catch (error) {
    // Usuario no autenticado
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="overflow-hidden rounded-full"
          >
            <Image
              src="/placeholder-user.jpg"
              width={36}
              height={36}
              alt="Avatar"
              className="overflow-hidden rounded-full"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Link href="/login">Sign In</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
}
