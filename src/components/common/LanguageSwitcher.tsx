import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "si", name: "සිංහල", flag: "🇱🇰" },
  { code: "ta", name: "தமிழ்", flag: "🇱🇰" },
];

interface LanguageSwitcherProps {
  variant?: "outline" | "ghost" | "default" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showText?: boolean;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = "outline",
  size = "sm",
  className = "",
  showText = true,
}) => {
  const { i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
    localStorage.setItem("i18nextLng", lang);
  };

  const currentCode = i18n.language ? i18n.language.split('-')[0] : "en";
  const currentLang = languages.find(l => l.code === currentCode) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={`inline-flex items-center gap-2 rounded-full border-border bg-background/80 backdrop-blur-sm transition-all hover:bg-accent ${className}`}
        >
          <Globe className="w-4 h-4 text-blue-500" />
          {showText && (
            <span className="text-xs font-medium text-foreground flex items-center gap-1.5">
              <span>{currentLang.flag}</span>
              <span>{currentLang.name}</span>
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36 rounded-xl border border-border bg-popover/95 backdrop-blur-md shadow-lg z-50">
        {languages.map((lang) => {
          const isSelected = currentCode === lang.code;
          return (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`flex items-center justify-between px-3 py-2 text-xs rounded-lg cursor-pointer transition-colors ${
                isSelected ? 'bg-primary/10 text-primary font-semibold' : 'text-foreground hover:bg-accent'
              }`}
            >
              <span>{lang.name}</span>
              <span className="text-sm">{lang.flag}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
