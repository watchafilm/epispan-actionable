'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/fitness-age', label: 'FitnessAge' },
  { href: '/symphony', label: 'Symphony' },
  { href: '/ebps-intervention', label: 'EBPS Intervention' },
  { href: '/reference', label: 'Reference' },
];

export function Header() {
  const pathname = usePathname();

  const NavLinks = ({ isMobile = false }: { isMobile?: boolean }) => (
    <nav
      className={cn(
        'flex items-center gap-4 lg:gap-6',
        isMobile && 'flex-col items-start gap-2'
      )}
    >
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'transition-colors hover:text-foreground/80 text-sm font-medium',
            pathname === item.href ? 'text-foreground' : 'text-foreground/60',
            isMobile && 'text-lg w-full p-2 hover:bg-muted rounded-md'
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-primary-foreground bg-primary p-1 rounded-sm" />
            <span className="hidden font-bold sm:inline-block">
              Actionable Insights Hub
            </span>
          </Link>
          <NavLinks />
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:hidden">
           <Link href="/" className="flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-primary-foreground bg-primary p-1 rounded-sm" />
            <span className="font-bold">AIH</span>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="p-4">
                 <NavLinks isMobile />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
