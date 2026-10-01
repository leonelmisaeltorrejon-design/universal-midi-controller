const BASE = '/universal-midi-controller/'
const CACHE_NAME = 'umc-vite-v1'

const APP_SHELL = [
  BASE,
  `${BASE}index.html`,
  `${BASE}manifest.webmanifest`,
  `${BASE}icon-192.png`,
  `${BASE}icon-512.png`,
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  )

  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  )

  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const request = event.request

  if (request.method !== 'GET') return

  const url = new URL(request.url)

  if (url.origin !== self.location.origin) return

  // Navegación: primero Internet, luego caché.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone()

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, clone)
          })

          return response
        })
        .catch(() =>
          caches.match(request).then(
            (cached) => cached || caches.match(BASE)
          )
        )
    )

    return
  }

  // Recursos estáticos: caché primero.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached

      return fetch(request).then((response) => {
        if (!response || response.status !== 200) {
          return response
        }

        const clone = response.clone()

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, clone)
        })

        return response
      })
    })
  )
})
