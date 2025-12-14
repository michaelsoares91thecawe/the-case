import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-outfit)', 'sans-serif'],
                serif: ['var(--font-playfair)', 'serif'],
            },
            colors: {
                wine: {
                    50: '#fcf4f4',
                    100: '#fbe8e8',
                    200: '#f7d5d5',
                    300: '#f0b3b3',
                    400: '#e68282',
                    500: '#d65454',
                    600: '#bf3434',
                    700: '#a32424',
                    800: '#872020', // Standard deep red
                    900: '#721e1e', // Very dark red
                    950: '#4a0404', // Almost black red (Bordeaux)
                },
                gold: {
                    100: '#fbf8ea',
                    200: '#f5ecce',
                    300: '#eddaaa',
                    400: '#e4c480',
                    500: '#d9aa55',
                    600: '#be8a3a',
                    700: '#98652c',
                    800: '#7d5128',
                    900: '#674324',
                }
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
        },
    },
    plugins: [],
};
export default config;
