import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import reactOxc from '@vitejs/plugin-react-oxc'; // change this line

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        reactOxc(), // and this line
    ],
});