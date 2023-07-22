const express = require('express');
const path = require('path');
const { createServer } = require('vite');
const browserSync = require('browser-sync').create();

async function startServer() {
    const app = express();

    const vite = await createServer({
        server: { middlewareMode: true },
        appType: 'mpa',
    });

    // Serve 11ty files
    app.use('/blog', express.static(path.join(__dirname, '/_site_blog')));
    // app.use(express.static(path.join(__dirname, '/dist')));
    
    browserSync.init({
        files: '_site_blog/**/*',
        port: 3000, 
        ui: false, // disables the Browsersync UI
        open: false, // prevents opening a new browser tab on start
        notify: false, // disables the "Connected to Browsersync" message
        proxy: 'localhost:3333',
        serveStatic: [{
          route: '/blog',
          dir: '_site_blog'
        }],
    });

    // Use Vite's middleware
    app.use(vite.middlewares);
    app.listen(3333, () => {
        console.log('Server running at http://localhost:3000');
  });
}

startServer();