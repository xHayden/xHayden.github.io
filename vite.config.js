import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// The build rewrites index.html's entry <script> and drops its blocking="render", which keeps the
// first paint waiting for the app (so the crossfade in from the blog lands on the page rather than
// a blank one, see index.html). Put it back.
const renderBlockingEntry = {
  name: 'render-blocking-entry',
  apply: 'build',
  transformIndexHtml: {
    order: 'post',
    handler: (html) => html.replace('<script type="module" crossorigin', '<script type="module" blocking="render" crossorigin'),
  },
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), renderBlockingEntry],
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