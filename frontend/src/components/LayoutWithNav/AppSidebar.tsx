'use client';
import { Calendar, ChevronUp, Home, Inbox, Search, Settings, User2 } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import { getCookie, removeCookies } from '@/lib/cookies';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const items = [
  {
    title: 'Tablice',
    url: '/home',
    icon: Home,
  },
  {
    title: 'Powiadomienia',
    url: '/notifications',
    icon: Inbox,
  },
  {
    title: 'Kalendarz',
    url: '/calendar',
    icon: Calendar,
  },
  {
    title: 'Szukaj',
    url: '/search',
    icon: Search,
  },
];

const other = [
  {
    title: 'Ustawienia',
    url: '/settings',
    icon: Settings,
  },
];

export function AppSidebar() {
  const [userName, setUserName] = useState<string | undefined>();
  const router = useRouter();

  useEffect(() => {
    const fetchCookie = async () => {
      const cookie = await getCookie('name');
      const name = cookie?.value;
      setUserName(name);
    };

    fetchCookie();
  }, []);

  const handleSignOut = () => {
    removeCookies();
    router.push('/');
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Aplikacja</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Inne</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {other.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> {userName ? userName : 'Ładowanie...'}
                  <ChevronUp className='ml-auto' />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side='top' className='w-[--radix-popper-anchor-width]'>
                <DropdownMenuItem className='m-2 cursor-pointer text-right'>
                  <span onClick={handleSignOut}>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
