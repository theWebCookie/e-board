'use client';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import Image from 'next/image';
import Link from 'next/link';

const Nav = () => {
  return (
    <nav className='border-b flex justify-between px-4 items-center h-16'>
      <div>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary'>
              <Link href='/home' legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>Tablica</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary'>
              <Link href='/history' legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>Historia</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary'>
              <Link href='/profile' legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>Profil</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div>
        <span className='flex shrink-0 w-8 h-8 rounded-full overflow-hidden'>
          <Image src='/avatar.png' alt='avatar' width={32} height={32} className='aspect-squre h-full w-full' />
        </span>
      </div>
    </nav>
  );
};

export default Nav;
