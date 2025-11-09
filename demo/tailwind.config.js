/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Legmint Brand Colors
        mint: {
          50: '#e6fdf5',
          100: '#ccfbeb',
          200: '#99f7d7',
          300: '#66f3c3',
          400: '#4BE1A0', // Primary mint
          500: '#3bc890',
          600: '#2ea072',
          700: '#227854',
          800: '#165036',
          900: '#0a2818',
        },
        navy: {
          50: '#e8e9ea',
          100: '#d1d2d5',
          200: '#a3a5ab',
          300: '#757881',
          400: '#474b57',
          500: '#1C1E26', // Primary navy
          600: '#16181e',
          700: '#111217',
          800: '#0b0c0f',
          900: '#050608',
        },
        slate: {
          50: '#f5f6f7',
          100: '#ebedef',
          200: '#d7dbdf',
          300: '#c3c9cf',
          400: '#afb7bf',
          500: '#5C6370', // Primary slate
          600: '#4a4f5a',
          700: '#373b43',
          800: '#25282d',
          900: '#121416',
        },
        offwhite: '#F8F9FB',
        // Legacy colors (keeping for backward compatibility during transition)
        primary: {
          50: '#e6fdf5',
          100: '#ccfbeb',
          200: '#99f7d7',
          300: '#66f3c3',
          400: '#4BE1A0',
          500: '#3bc890',
          600: '#2ea072',
          700: '#227854',
          800: '#165036',
          900: '#0a2818',
        },
      },
    },
  },
  plugins: [],
}