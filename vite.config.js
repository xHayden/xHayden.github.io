import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      ignored: [
        path.resolve(__dirname, './blog/**'), 
        path.resolve(__dirname, './tina/**'),
        path.resolve(__dirname, '.eleventy.js'),
        path.resolve(__dirname, 'dev-server.js'),
        path.resolve(__dirname, './_site_blog/**')
      ],
    }
  }
});