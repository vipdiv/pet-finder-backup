import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#f8f2e8',
        park: '#214732',
        sepia: '#7a5d3f',
        stamp: '#a23f2b'
      },
      boxShadow: {
        frame: '0 0 0 2px #7a5d3f, 0 0 0 4px #f8f2e8'
      }
    }
  },
  plugins: []
};

export default config;
