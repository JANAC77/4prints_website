import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

const r2Client = new S3Client({
  endpoint: 'https://a70d86b21360a62b32237371962c1f87.r2.cloudflarestorage.com',
  credentials: {
    accessKeyId: 'c9e3a3befa14625982f3a35ad83ac7d3',
    secretAccessKey: '7264cc2421ef8d27247ca49c1c4f4015c1c39185ad2609580433b6d184a84d09',
  },
  region: 'auto',
});

const R2_BUCKET = '4printdev';

function r2MediaPlugin() {
  return {
    name: 'r2-media-proxy',
    configureServer(server) {
      server.middlewares.use('/r2-media', async (req, res, next) => {
        try {
          const rawKey = req.url.replace(/^\/+/, '').split('?')[0];
          if (!rawKey) return next();

          const key = decodeURIComponent(rawKey);

          const r2Response = await r2Client.send(
            new GetObjectCommand({
              Bucket: R2_BUCKET,
              Key: key,
            })
          );

          res.statusCode = 200;
          res.setHeader('Content-Type', r2Response.ContentType || 'image/jpeg');
          if (r2Response.ContentLength) {
            res.setHeader('Content-Length', r2Response.ContentLength);
          }
          res.setHeader('Cache-Control', 'public, max-age=604800');

          if (r2Response.Body && typeof r2Response.Body.pipe === 'function') {
            r2Response.Body.pipe(res);
          } else {
            const bytes = await r2Response.Body.transformToByteArray();
            res.end(Buffer.from(bytes));
          }
        } catch (err) {
          console.warn('R2 proxy fetch error for:', req.url, err.message);
          res.statusCode = 404;
          res.end('Image not found');
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), r2MediaPlugin()],
  server: {
    proxy: {
      '/categories': {
        target: 'https://api.autoneu.in',
        changeOrigin: true,
        secure: false,
      },
      '/products': {
        target: 'https://api.autoneu.in',
        changeOrigin: true,
        secure: false,
      },
      '/auth': {
        target: 'https://api.autoneu.in',
        changeOrigin: true,
        secure: false,
      },
      '/user': {
        target: 'https://api.autoneu.in',
        changeOrigin: true,
        secure: false,
      },
      '/hello': {
        target: 'https://api.autoneu.in',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
