'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, Suspense } from 'react';
import { CircleIcon, LayoutDashboard, Settings, Shield, Activity, LogOut, Home } from 'lucide-react';
import { ThemeSelector } from '@/components/theme-selector';
import { signOut } from '@/app/(login)/actions';
import { User } from '@/lib/db/schema';
import useSWR from 'swr';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const fetcher = (url: string) => fetch(url).then((res) => res.json());


function UserMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: user } = useSWR<User>('/api/user', fetcher);

  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <DropdownMenuTrigger>
        <Avatar className="cursor-pointer size-9">
          <AvatarImage alt={user.name || ''} />
          <AvatarFallback>
            {user.email
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="flex flex-col gap-1">
        <DropdownMenuItem className="cursor-pointer">
          <Link href="/dashboard" className="flex w-full items-center">
            <Home className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive?: boolean;
}

function DashboardSidebar() {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      isActive: pathname === '/dashboard',
    },
    {
      title: 'Activity',
      href: '/dashboard/activity',
      icon: Activity,
      isActive: pathname === '/dashboard/activity',
    },
    {
      title: 'General',
      href: '/dashboard/general',
      icon: Settings,
      isActive: pathname === '/dashboard/general',
    },
    {
      title: 'Security',
      href: '/dashboard/security',
      icon: Shield,
      isActive: pathname === '/dashboard/security',
    },
  ];

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <CircleIcon className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold">ACME Dashboard</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={item.isActive}>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

function getBreadcrumbItems(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  const items = [];
  
  items.push({ label: 'Dashboard', href: '/dashboard' });
  
  if (segments.length > 1) {
    const page = segments[segments.length - 1];
    const pageLabel = page.charAt(0).toUpperCase() + page.slice(1);
    items.push({ label: pageLabel, href: pathname });
  }
  
  return items;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const breadcrumbItems = getBreadcrumbItems(pathname);

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 flex-1">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbItems.map((item, index) => (
                  <div key={item.href} className="flex items-center">
                    {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
                    <BreadcrumbItem className="hidden md:block">
                      {index === breadcrumbItems.length - 1 ? (
                        <BreadcrumbPage>{item.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link href={item.href}>{item.label}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </div>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-2 px-4">
            <ThemeSelector />
            <Suspense fallback={<div className="h-9" />}>
              <UserMenu />
            </Suspense>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
