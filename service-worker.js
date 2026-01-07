        const CACHE_NAME = 'controle-ponto-v1';
        const urlsToCache = [
            '/Registro-de-Ponto/', // A raiz do seu site
            '/Registro-de-Ponto/index.html',
            '/Registro-de-Ponto/manifest.json',
            '/Registro-de-Ponto/icon-192x192.png',
            '/Registro-de-Ponto/icon-512x512.png',
            'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap',
            'https://unpkg.com/xlsx/dist/xlsx.full.min.js'
        ];

        self.addEventListener('install', (event) => {
            event.waitUntil(
                caches.open(CACHE_NAME)
                    .then((cache) => {
                        console.log('Cache aberto');
                        return cache.addAll(urlsToCache);
                    })
            );
        });

        self.addEventListener('fetch', (event) => {
            event.respondWith(
                caches.match(event.request)
                    .then((response) => {
                        // Retorna o recurso do cache se encontrado
                        if (response) {
                            return response;
                        }
                        // Se não estiver no cache, busca na rede
                        return fetch(event.request).then(
                            (response) => {
                                // Verifica se recebemos uma resposta válida
                                if (!response || response.status !== 200 || response.type !== 'basic') {
                                    return response;
                                }

                                // Clona a resposta. Uma resposta é um stream e só pode ser consumida uma vez.
                                // Precisamos consumi-la aqui para o cache e o navegador precisa consumi-la também.
                                const responseToCache = response.clone();

                                caches.open(CACHE_NAME)
                                    .then((cache) => {
                                        cache.put(event.request, responseToCache);
                                    });

                                return response;
                            }
                        );
                    })
            );
        });

        self.addEventListener('activate', (event) => {
            const cacheWhitelist = [CACHE_NAME];
            event.waitUntil(
                caches.keys().then((cacheNames) => {
                    return Promise.all(
                        cacheNames.map((cacheName) => {
                            if (cacheWhitelist.indexOf(cacheName) === -1) {
                                return caches.delete(cacheName);
                            }
                        })
                    );
                })
            );
        });
