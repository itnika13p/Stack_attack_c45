import { defineConfig } from 'vitest/config';
import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig({
  base: './',
  plugins: [VitePWA({
    registerType: 'prompt',
    includeAssets: ['icons/icon-192.png', 'icons/icon-512.png'],
    manifest: { name: 'Stack Attack — C45', short_name: 'Stack Attack', description: 'An unofficial monochrome warehouse game recreation.', start_url: './', scope: './', display: 'standalone', orientation: 'portrait', background_color: '#b8bd86', theme_color: '#b8bd86', icons: [{src:'icons/icon-192.png',sizes:'192x192',type:'image/png'}, {src:'icons/icon-512.png',sizes:'512x512',type:'image/png',purpose:'any maskable'}] },
    workbox: {globPatterns:['**/*.{js,css,html,png,svg,webmanifest}'], navigateFallback:'index.html', cleanupOutdatedCaches:true, clientsClaim:true, skipWaiting:false}
  })],
  test: {include:['tests/*.test.ts'], coverage:{include:['src/game/**','src/input/**']} }
});
