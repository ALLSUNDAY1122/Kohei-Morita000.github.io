(() => {
  if (!('serviceWorker' in navigator) || location.protocol !== 'https:') return;

  const register = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/kyokai-yawa/service-worker.js', {
        scope: '/kyokai-yawa/',
        updateViaCache: 'none',
      });

      await registration.update();

      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }

      registration.addEventListener('updatefound', () => {
        const worker = registration.installing;
        if (!worker) return;
        worker.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) {
            worker.postMessage({ type: 'SKIP_WAITING' });
          }
        });
      });
    } catch (error) {
      console.warn('境界夜話のオフライン機能を開始できませんでした。', error);
    }
  };

  window.addEventListener('load', register, { once: true });
})();
