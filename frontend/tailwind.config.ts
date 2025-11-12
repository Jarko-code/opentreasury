/** @type {import('tailwindcss').Config} */
import tailwindcssPrimeui from 'tailwindcss-primeui';
export default {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}', './presets/**/*.{js,vue,ts}'],
    theme: {
        extend: {}
    },
    plugins: [tailwindcssPrimeui],
    darkMode: 'class'
};
