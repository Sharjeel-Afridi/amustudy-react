/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms';
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			lato: [
  				'Lato',
  				'sans-serif'
  			],
  			mont: [
  				'Montserrat',
  				'sans-serif'
  			],
  			source: [
  				'Source Serif 4',
  				'serif'
  			],
			iansui: [
				'Iansui',
				'sans-serif'
			  ]
  		},
  		colors: {
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				light: '#f9fafc',
  				dark: '#f3f4f6',
  				text: '#000',
  				post: '#242424',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				light: '#6a7180',
  				dark: '#1f222a',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				light: '#f5f5f7',
  				dark: '#c5c5c9',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			text: {
  				DEFAULT: '#ffffff',
  				muted: '#6a7180'
  			},
  			border: 'hsl(var(--border))',
  			background: {
				DEFAULT: 'hsl(var(--background))',
				light:'#f9fafc',
			},
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [
    forms,
      require("tailwindcss-animate"),
	  require("tailwind-scrollbar-hide")
],
}

