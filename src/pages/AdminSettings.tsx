import React from 'react';
import { useTheme } from 'next-themes';
import { useFontSize } from '@/contexts/FontSizeProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Monitor, Moon, Sun, Type } from 'lucide-react';
import { cn } from '@/lib/utils';

export const AdminSettings: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { fontSize, setFontSize } = useFontSize();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your interface preferences and accessibility settings.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Appearance Settings */}
        <Card className="border-2 hover:border-primary/50 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Monitor className="h-5 w-5" />
              </div>
              Appearance
            </CardTitle>
            <CardDescription>
              Customize the look and feel of the application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              defaultValue={theme}
              onValueChange={(value) => setTheme(value)}
              className="grid grid-cols-3 gap-4"
            >
              <div>
                <Label
                  htmlFor="theme-light"
                  className="cursor-pointer"
                >
                  <div className={cn(
                    "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4  hover:bg-primary/10 hover:text-primary hover:border-primary/30",
                    theme === 'light' ? 'border-primary bg-primary/5 text-primary' : ''
                  )}>
                    <Sun className="mb-3 h-6 w-6" />
                    <span className="font-semibold">Light</span>
                  </div>
                </Label>
                <RadioGroupItem value="light" id="theme-light" className="sr-only" />
              </div>

              <div>
                <Label
                  htmlFor="theme-dark"
                  className="cursor-pointer"
                >
                  <div className={cn(
                    "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-primary/10 hover:text-primary hover:border-primary/30",
                    theme === 'dark' ? 'border-primary bg-primary/5 text-primary' : ''
                  )}>
                    <Moon className="mb-3 h-6 w-6" />
                    <span className="font-semibold">Dark</span>
                  </div>
                </Label>
                <RadioGroupItem value="dark" id="theme-dark" className="sr-only" />
              </div>

              <div>
                <Label
                  htmlFor="theme-system"
                  className="cursor-pointer"
                >
                  <div className={cn(
                    "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-primary/10 hover:text-primary hover:border-primary/30",
                    theme === 'system' ? 'border-primary bg-primary/5 text-primary' : ''
                  )}>
                    <Monitor className="mb-3 h-6 w-6" />
                    <span className="font-semibold">System</span>
                  </div>
                </Label>
                <RadioGroupItem value="system" id="theme-system" className="sr-only" />
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Typography Settings */}
        <Card className="border-2 hover:border-primary/50 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Type className="h-5 w-5" />
              </div>
              Typography
            </CardTitle>
            <CardDescription>
              Adjust the global font size for better readability.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              defaultValue={fontSize}
              onValueChange={(value) => setFontSize(value as "small" | "medium" | "large")}
              className="grid gap-4"
            >
              <div className={cn(
                "flex items-center justify-between space-x-2 rounded-lg border-2 p-4 transition-colors",
                fontSize === 'small' ? 'border-primary bg-primary/5' : 'border-transparent bg-secondary hover:bg-secondary/80'
              )}>
                <Label htmlFor="font-small" className="flex flex-1 cursor-pointer items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium text-sm">Small</p>
                    <p className="text-xs text-muted-foreground">Compact view, more information.</p>
                  </div>
                  <Type className="h-4 w-4 text-muted-foreground" />
                </Label>
                <RadioGroupItem value="small" id="font-small" />
              </div>

              <div className={cn(
                "flex items-center justify-between space-x-2 rounded-lg border-2 p-4 transition-colors",
                fontSize === 'medium' ? 'border-primary bg-primary/5' : 'border-transparent bg-secondary hover:bg-secondary/80'
              )}>
                <Label htmlFor="font-medium" className="flex flex-1 cursor-pointer items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium text-base">Medium (Default)</p>
                    <p className="text-sm text-muted-foreground">Standard comfortable reading size.</p>
                  </div>
                  <Type className="h-5 w-5 text-muted-foreground" />
                </Label>
                <RadioGroupItem value="medium" id="font-medium" />
              </div>

              <div className={cn(
                "flex items-center justify-between space-x-2 rounded-lg border-2 p-4 transition-colors",
                fontSize === 'large' ? 'border-primary bg-primary/5' : 'border-transparent bg-secondary hover:bg-secondary/80'
              )}>
                <Label htmlFor="font-large" className="flex flex-1 cursor-pointer items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium text-lg">Large</p>
                    <p className="text-base text-muted-foreground">Enhanced readability and accessibility.</p>
                  </div>
                  <Type className="h-6 w-6 text-muted-foreground" />
                </Label>
                <RadioGroupItem value="large" id="font-large" />
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
