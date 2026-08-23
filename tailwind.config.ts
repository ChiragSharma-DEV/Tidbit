import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'Instrument Serif', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'Newsreader', 'Georgia', 'serif'],
        ui: ['var(--font-ui)', 'Instrument Sans', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'IBM Plex Mono', 'monospace'],
        sans: ['var(--font-ui)', 'Instrument Sans', 'system-ui', 'sans-serif'],
        serif: ['var(--font-display)', 'Instrument Serif', 'Georgia', 'serif'],
      },
      colors: {
        stock: 'var(--stock)',
        paper: 'var(--stock)',
        insert: 'var(--insert)',
        'card-white': 'var(--insert)',
        'surface-container-lowest': 'var(--insert)',
        ink: 'var(--ink)',
        'on-surface': 'var(--ink)',
        graphite: 'var(--graphite)',
        'on-surface-variant': 'var(--graphite)',
        rule: 'var(--rule)',
        hairline: 'var(--rule)',
        inset: 'var(--inset)',
        'ink-blue': 'var(--hue-tech)',
        'hue-tech': 'var(--hue-tech)',
        'hue-psych': 'var(--hue-psych)',
        'hue-marketing': 'var(--hue-marketing)',
        'hue-writing': 'var(--hue-writing)',
        'hue-money': 'var(--hue-money)',
        'hue-space': 'var(--hue-space)',
        'hue-health': 'var(--hue-health)',
        'hue-default': 'var(--hue-default)',
      },
      borderRadius: {
        card: 'var(--r-card)',
        control: 'var(--r-control)',
        inset: 'var(--r-inset)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
      },
    },
  },
  plugins: [],
};

export default config;
