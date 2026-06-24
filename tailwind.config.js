export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#050807',
        ink: '#E8F0EC',
        dim: 'rgba(232,240,236,0.4)',
        acid: '#00E08A',
        forest: '#0A3D26',
        moss: '#1A2E22',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        body: ['"Syne"', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
