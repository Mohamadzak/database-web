import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { from, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

// Define folder paths
const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

// Create Express app
const app = express();
const angularApp = new AngularNodeAppEngine();

// Serve static files from /browser
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  })
);

// Handle all requests with Angular SSR using RxJS
app.use('/**', (req, res, next) => {
  from(angularApp.handle(req)).pipe(
    tap((response) => {
      if (response) {
        writeResponseToNodeResponse(response, res);
      } else {
        next();
      }
    }),
    catchError((error) => {
      console.error('SSR Error:', error);
      next(error);
      return of(null); // Return an empty observable to prevent breaking the chain
    })
  ).subscribe();
});

// Start the server if this module is the main entry point
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  from(
    new Promise<void>((resolve) => {
      app.listen(port, () => {
        console.log(`Node Express server listening on http://localhost:${port}`);
        resolve();
      });
    })
  ).subscribe();
}

// Request handler for Angular CLI or Firebase Cloud Functions
export const reqHandler = createNodeRequestHandler(app);
