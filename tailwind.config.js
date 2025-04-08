/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        galaxy: {
          pink: "#ea4c89",
          purple: "#8f4bde",
          blue: "#4668ea",
          deep: "#0a0a1e",
        },
      },
      boxShadow: {
        glow: "0 0 10px rgba(143, 75, 222, 0.5), 0 0 20px rgba(70, 104, 234, 0.3)",
        "glow-pink": "0 0 10px rgba(234, 76, 137, 0.5), 0 0 20px rgba(234, 76, 137, 0.3)",
        "glow-purple": "0 0 10px rgba(143, 75, 222, 0.5), 0 0 20px rgba(143, 75, 222, 0.3)",
        "glow-blue": "0 0 10px rgba(70, 104, 234, 0.5), 0 0 20px rgba(70, 104, 234, 0.3)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-primary": "linear-gradient(90deg, #ea4c89 0%, #8f4bde 50%, #4668ea 100%)",
        "galaxy": "radial-gradient(circle at 10% 20%, rgba(91, 37, 178, 0.15) 0%, rgba(10, 10, 30, 0) 60%), radial-gradient(circle at 90% 50%, rgba(234, 76, 137, 0.1) 0%, rgba(10, 10, 30, 0) 60%), radial-gradient(circle at 50% 80%, rgba(76, 104, 234, 0.1) 0%, rgba(10, 10, 30, 0) 60%)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-glow": {
          "0%, 100%": { 
            opacity: 0.7,
            transform: "scale(1)",
          },
          "50%": { 
            opacity: 1,
            transform: "scale(1.05)",
          },
        },
        "twinkle": {
          "0%, 100%": { opacity: 0.3 },
          "50%": { opacity: 1 },
        },
        "loading-bar": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(400%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float": "float 6s infinite ease-in-out",
        "pulse-glow": "pulse-glow 4s infinite ease-in-out",
        "twinkle": "twinkle 4s infinite ease-in-out",
        "loading-bar": "loading-bar 2s infinite linear",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}