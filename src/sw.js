import { precacheAndRoute, createHandlerBoundToURL, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import { NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
// eslint-disable-next-line no-undef
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches(); 

registerRoute(new NavigationRoute(createHandlerBoundToURL('index.html')));

registerRoute(
  ({ url }) =>
    (url.origin === 'https://remarkable-cassata-5e99fd.netlify.app' &&
      url.pathname.startsWith('/.netlify/functions/')) ||
    url.pathname.endsWith('/news'),
  new NetworkFirst({
    cacheName: 'api-cache',
    networkTimeoutSeconds: 3,
    plugins: [new CacheableResponsePlugin({ statuses: [200] })],
  })
);

registerRoute(
  ({ request }) => request.destination === 'image',
  new StaleWhileRevalidate({ cacheName: 'image-cache' })
);
