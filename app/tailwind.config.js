/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  // Safelist semantic utilities so dynamic accent strings always ship.
  safelist: [
    { pattern: /^(bg|text|border|ring)-(brand|pos|neg|warn)(-(soft|fill|line|on-fill))?$/ },
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        ink: {
          1: 'var(--ink-1)',
          2: 'var(--ink-2)',
          3: 'var(--ink-3)',
          4: 'var(--ink-4)',
        },
        surface: {
          0: 'var(--surface-0)',
          1: 'var(--surface-1)',
          2: 'var(--surface-2)',
        },
        line: {
          DEFAULT: 'var(--line)',
          strong:  'var(--line-strong)',
        },
        // Semantic accents — same class names work in light + dark
        brand: {
          DEFAULT:      'var(--brand)',
          fill:         'var(--brand-fill)',
          'fill-hover': 'var(--brand-fill-hover)',
          soft:         'var(--brand-soft)',
          'soft-hover': 'var(--brand-soft-hover)',
          line:         'var(--brand-line)',
          'on-fill':    'var(--brand-on-fill)',
        },
        pos: {
          DEFAULT: 'var(--pos)',
          fill:    'var(--pos-fill)',
          soft:    'var(--pos-soft)',
          line:    'var(--pos-line)',
        },
        neg: {
          DEFAULT: 'var(--neg)',
          soft:    'var(--neg-soft)',
          line:    'var(--neg-line)',
        },
        warn: {
          DEFAULT: 'var(--warn)',
          soft:    'var(--warn-soft)',
          line:    'var(--warn-line)',
        },
      },
      borderColor: {
        DEFAULT: 'var(--line)',
      },
      keyframes: {
        'pulse-soft': {
          '0%, 100%': { opacity: '0.55' },
          '50%':       { opacity: '1' },
        },
        'scroll-up': {
          '0%':   { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-50%)' },
        },
      },
      animation: {
        'pulse-soft': 'pulse-soft 2.4s ease-in-out infinite',
        'scroll-up':  'scroll-up 60s linear infinite',
      },
    },
  },
  plugins: [],
}
