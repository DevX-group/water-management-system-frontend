import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: colors.slate[200],
        input: colors.slate[200],
        ring: colors.blue[500],
        background: colors.slate[50],
        foreground: colors.slate[900],
        primary: {
          DEFAULT: colors.blue[500],
          foreground: colors.white,
        },
        secondary: {
          DEFAULT: colors.slate[100],
          foreground: colors.slate[900],
        },
        destructive: {
          DEFAULT: colors.red[500],
          foreground: colors.white,
        },
        success: {
          DEFAULT: colors.emerald[500],
          foreground: colors.white,
        },
        warning: {
          DEFAULT: colors.amber[500],
          foreground: colors.white,
        },
        muted: {
          DEFAULT: colors.slate[100],
          foreground: colors.slate[500],
        },
        accent: {
          DEFAULT: colors.cyan[500],
          foreground: colors.white,
        },
        popover: {
          DEFAULT: colors.white,
          foreground: colors.slate[900],
        },
        card: {
          DEFAULT: colors.white,
          foreground: colors.slate[900],
        },
        sidebar: {
          DEFAULT: colors.white,
          foreground: colors.slate[900],
          primary: colors.blue[500],
          "primary-foreground": colors.white,
          accent: colors.slate[100],
          "accent-foreground": colors.slate[900],
          border: colors.slate[200],
          ring: colors.blue[500],
        },
      },
      borderRadius: {
        lg: "1rem",
        md: "calc(1rem - 2px)",
        sm: "calc(1rem - 4px)",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "slide-in-right": "slide-in-right 0.4s ease-out forwards",
        "scale-in": "scale-in 0.3s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
