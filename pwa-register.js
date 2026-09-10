// pwa-register.js — Enregistrement PWA ARVEXA
(function () {
  if (!('serviceWorker' in navigator)) {
    console.warn('[PWA] Service Worker non supporté');
    return;
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((registration) => {
        console.log('[PWA] ✅ SW enregistré, scope:', registration.scope);

        // Vérifier les mises à jour
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[PWA] 🔄 Nouvelle version disponible');
            }
          });
        });
      })
      .catch((err) => console.error('[PWA] ❌ Échec enregistrement SW:', err));
  });

  // Détection de l'événement beforeinstallprompt
  let deferredPrompt = null;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    console.log('[PWA] 📲 Installation disponible');

    // Afficher un bouton d'installation s'il existe
    const installBtn = document.getElementById('pwa-install-btn');
    if (installBtn) {
      installBtn.style.display = 'inline-flex';
      installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log('[PWA] Choix utilisateur:', outcome);
        deferredPrompt = null;
        installBtn.style.display = 'none';
      });
    }
  });

  window.addEventListener('appinstalled', () => {
    console.log('[PWA] 🎉 App installée');
    deferredPrompt = null;
  });
})();
