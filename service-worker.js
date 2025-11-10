// Define a unique cache name, good practice to increment this number 
// when you make changes to your PWA's core files.
const CACHE_NAME = 'tic-tac-toe-v1';

// List of files to cache (your core application files)
const urlsToCache = [
    '/', // Important: Caches the index.html at the root
    'index.html',
    'style.css',
    'script.js',
    'manifest.json',
    // Add paths to your icons here (assuming they are in an 'images' folder)
    'images/icon-192x192.png',
    'images/icon-512x512.png',
    'images/maskable_icon.png'
];

// --- INSTALL EVENT ---
// The service worker is installed, and the app shell files are cached.
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache, pre-caching all required assets.');
                return cache.addAll(urlsToCache);
            })
            .catch((error) => {
                console.error('Failed to pre-cache assets:', error);
            })
    );
});

// --- FETCH EVENT ---
// Intercepts network requests and serves content from the cache if available.
self.addEventListener('fetch', (event) => {
    // We're using a Cache-First strategy:
    // 1. Check the cache for a match.
    // 2. If found, return the cached response.
    // 3. If not found, fetch from the network.
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                // No cache match, fetch from network
                return fetch(event.request);
            })
    );
});

// --- ACTIVATE EVENT ---
// Cleans up old caches from previous versions of the service worker.
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        // Delete old caches
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});