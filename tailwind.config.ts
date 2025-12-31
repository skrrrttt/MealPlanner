import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ios: {
          blue: '#007AFF',
          gray: {
            1: '#F2F2F7',
            2: '#E5E5EA',
            3: '#D1D1D6',
            4: '#C7C7CC',
            5: '#AEAEB2',
            6: '#8E8E93',
          },
        },
      },
      borderRadius: {
        'ios': '10px',
        'ios-lg': '20px',
      },
      boxShadow: {
        'ios': '0 2px 8px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}
export default config
