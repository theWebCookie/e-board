import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import Link from 'next/link';

const Nav = () => {
  return (
    <nav>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href='/home' legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Tablica</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href='/history' legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Historia</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href='/profile' legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Profil</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
};

export default Nav;
