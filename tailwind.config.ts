
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Game specific colors
				stage: {
					early: {
						bg: '#D3E4FD',
						door: '#33C3F0',
						text: '#222222',
					},
					middle: {
						bg: '#E5DEFF',
						door: '#9b87f5',
						text: '#403E43',
					},
					late: {
						bg: '#1A1F2C',
						door: '#6E59A5',
						text: '#FFFFFF',
					},
					final: {
						bg: '#000000',
						door: '#8B5CF6',
						text: '#D946EF',
					},
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'glitch': {
					'0%': {
						transform: 'translate(0)'
					},
					'20%': {
						transform: 'translate(-5px, 5px)'
					},
					'40%': {
						transform: 'translate(-5px, -5px)'
					},
					'60%': {
						transform: 'translate(5px, 5px)'
					},
					'80%': {
						transform: 'translate(5px, -5px)'
					},
					'100%': {
						transform: 'translate(0)'
					}
				},
				'door-hover': {
					'0%': {
						transform: 'scale(1)'
					},
					'100%': {
						transform: 'scale(1.05)'
					}
				},
				'door-open': {
					'0%': {
						transform: 'perspective(600px) rotateY(0)'
					},
					'100%': {
						transform: 'perspective(600px) rotateY(-105deg)'
					}
				},
				'door-peek': {
					'0%': {
						transform: 'perspective(600px) rotateY(0)'
					},
					'100%': {
						transform: 'perspective(600px) rotateY(-30deg)'
					}
				},
				'static': {
					'0%': {
						opacity: '0.3',
					},
					'10%': {
						opacity: '0.6',
					},
					'20%': {
						opacity: '0.1',
					},
					'30%': {
						opacity: '0.7',
					},
					'40%': {
						opacity: '0.2',
					},
					'50%': {
						opacity: '0.9',
					},
					'60%': {
						opacity: '0.4',
					},
					'70%': {
						opacity: '0.8',
					},
					'80%': {
						opacity: '0.1',
					},
					'90%': {
						opacity: '0.5',
					},
					'100%': {
						opacity: '0.3',
					},
				},
				'floating': {
					'0%': {
						transform: 'translateY(0px)'
					},
					'50%': {
						transform: 'translateY(-10px)'
					},
					'100%': {
						transform: 'translateY(0px)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.4s ease-out',
				'glitch': 'glitch 0.3s ease-in-out infinite',
				'door-hover': 'door-hover 0.2s forwards',
				'door-open': 'door-open 0.8s forwards',
				'door-peek': 'door-peek 0.4s forwards',
				'static': 'static 0.15s infinite',
				'floating': 'floating 3s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
