import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pearl: {
          50: "#FEFEFE",
          100: "#FAFAF9",
          200: "#F5F4F1",
          300: "#EDEAE5",
          DEFAULT: "#F8F6F2",
        },
        ivory: {
          50: "#FFFEF9",
          100: "#FDF9EF",
          200: "#F9F2E0",
          300: "#F3E8C8",
          DEFAULT: "#FAF6EC",
        },
        champagne: {
          50: "#FEFDF8",
          100: "#FBF6E7",
          200: "#F4E9C8",
          300: "#EAD89E",
          400: "#DCBE6A",
          500: "#C9A84C",
          DEFAULT: "#C9A84C",
        },
        stone: {
          warm: "#8B7D6B",
          light: "#B5A99A",
          DEFAULT: "#6B5E52",
          dark: "#3D352D",
        },
        gold: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#D4A843",
          400: "#B8922E",
          500: "#9A7A1F",
          DEFAULT: "#C9A84C",
          light: "#E8D5A0",
          muted: "#E0C97A",
        },
        roope: {
          primary: "#1A1612",
          secondary: "#3D352D",
          accent: "#C9A84C",
          muted: "#8B7D6B",
          light: "#F8F6F2",
          glass: "rgba(255,255,255,0.72)",
        },
      },
      fontFamily: {
        display: ["var(--font-instrument)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "pearl-gradient": "linear-gradient(135deg, #FEFEFE 0%, #F8F6F2 50%, #FAF6EC 100%)",
        "champagne-gradient": "linear-gradient(135deg, #FAF6EC 0%, #F3E8C8 50%, #EAD89E 100%)",
        "hero-gradient": "linear-gradient(160deg, #FFFFFF 0%, #F8F6F2 30%, #FAF6EC 60%, #F3E8C8 100%)",
        "card-gradient": "linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(248,246,242,0.7) 100%)",
        "gold-gradient": "linear-gradient(135deg, #D4A843 0%, #C9A84C 50%, #B8922E 100%)",
        "dark-gradient": "linear-gradient(135deg, #1A1612 0%, #3D352D 100%)",
      },
      boxShadow: {
        "luxury": "0 4px 24px rgba(26,22,18,0.06), 0 1px 4px rgba(26,22,18,0.04)",
        "luxury-lg": "0 8px 48px rgba(26,22,18,0.10), 0 2px 8px rgba(26,22,18,0.05)",
        "luxury-xl": "0 16px 64px rgba(26,22,18,0.14), 0 4px 16px rgba(26,22,18,0.08)",
        "gold": "0 4px 24px rgba(201,168,76,0.25), 0 1px 4px rgba(201,168,76,0.15)",
        "gold-lg": "0 8px 48px rgba(201,168,76,0.35), 0 2px 8px rgba(201,168,76,0.20)",
        "glass": "0 8px 32px rgba(26,22,18,0.08), inset 0 1px 0 rgba(255,255,255,0.8)",
        "float": "0 20px 60px rgba(26,22,18,0.12), 0 4px 16px rgba(26,22,18,0.06)",
        "inset-luxury": "inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(26,22,18,0.04)",
      },
      backdropBlur: {
        xs: "2px",
        "4xl": "40px",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "float-delay": "float 6s ease-in-out 2s infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "shimmer": "shimmer 2.5s linear infinite",
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "scale-up": "scaleUp 0.4s ease-out forwards",
        "slide-in-right": "slideInRight 0.5s ease-out forwards",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleUp: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(201,168,76,0)" },
          "50%": { boxShadow: "0 0 0 8px rgba(201,168,76,0.15)" },
        },
      },
      transitionTimingFunction: {
        "luxury": "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "premium": "cubic-bezier(0.16, 1, 0.3, 1)",
        "cinematic": "cubic-bezier(0.77, 0, 0.175, 1)",
      },
      transitionDuration: {
        "400": "400ms",
        "600": "600ms",
        "800": "800ms",
        "1200": "1200ms",
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "100": "25rem",
        "112": "28rem",
        "128": "32rem",
      },
      letterSpacing: {
        "luxury": "0.08em",
        "editorial": "0.12em",
        "wide-luxury": "0.06em",
      },
      lineHeight: {
        "editorial": "1.1",
        "tight-luxury": "1.15",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      zIndex: {
        "60": "60",
        "70": "70",
        "80": "80",
        "90": "90",
        "100": "100",
      },
    },
  },
  plugins: [],
};

export default config;
