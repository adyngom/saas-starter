'use client';

import * as React from 'react';
import { Monitor, Moon, Palette, Sun, Check } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useColorTheme } from '@/lib/theme-context';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const { colorTheme, setColorTheme, availableThemes } = useColorTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Palette className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Sun className="h-4 w-4" />
          Color Mode
        </DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
          {theme === 'light' && <Check className="ml-auto h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
          {theme === 'dark' && <Check className="ml-auto h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <Monitor className="mr-2 h-4 w-4" />
          <span>System</span>
          {theme === 'system' && <Check className="ml-auto h-4 w-4" />}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          Color Theme
        </DropdownMenuLabel>
        {availableThemes.map((themeConfig) => (
          <DropdownMenuItem
            key={themeConfig.name}
            onClick={() => setColorTheme(themeConfig.name)}
            className="flex items-center gap-2"
          >
            <div className="flex items-center gap-2 flex-1">
              <div className="flex gap-1">
                <div
                  className="w-3 h-3 rounded-full border"
                  style={{ backgroundColor: themeConfig.previewColors.primary }}
                />
                <div
                  className="w-3 h-3 rounded-full border"
                  style={{ backgroundColor: themeConfig.previewColors.secondary }}
                />
              </div>
              <span>{themeConfig.label}</span>
            </div>
            {colorTheme === themeConfig.name && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Keep the original ThemeToggle for backward compatibility
export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}