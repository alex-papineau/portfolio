// Client-side controller for Amazon SMT Music Companion Showcase

declare global {
  interface Window {
    chrome?: any;
    browser?: any;
    __smt_runtime?: any;
    __smt_showcase_cleanup?: () => void;
  }
}

export function initAmazonSmtShowcase() {
  const root = document.getElementById('smt-showcase-root');
  if (!root) return;

  // Cleanup any previous instance (e.g. from page transitions)
  if (window.__smt_showcase_cleanup) {
    window.__smt_showcase_cleanup();
    window.__smt_showcase_cleanup = undefined;
  }

  const urlDisplay = document.getElementById('smt-url-display') as HTMLInputElement | null;
  const tabAmazon = document.getElementById('tab-amazon');
  const tabWikipedia = document.getElementById('tab-wikipedia');
  const tabGoogle = document.getElementById('tab-google');
  const btnPopup = document.getElementById('btn-smt-popup');
  const popupContainer = document.getElementById('smt-popup-container');
  const popupIframe = document.getElementById('smt-popup-iframe') as HTMLIFrameElement | null;
  const viewportAmazon = document.getElementById('viewport-amazon');
  const viewportWikipedia = document.getElementById('viewport-wikipedia');
  const viewportGoogle = document.getElementById('viewport-google');
  const statusLed = document.getElementById('smt-status-led');
  const statusText = document.getElementById('smt-status-text');

  let currentTab = 'amazon.ca';
  let isPopupOpen = false;

  // Ensure runtime shim is loaded, then config.js, then background.js
  function loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        resolve();
        return;
      }
      const s = document.createElement('script');
      s.src = src;
      s.async = false;
      s.onload = () => resolve();
      s.onerror = (e) => reject(e);
      document.head.appendChild(s);
    });
  }

  async function bootExtension() {
    try {
      await loadScript('/showcases/amazon-smt-companion/runtime/chrome-runtime-shim.js');
      await loadScript('/showcases/amazon-smt-companion/config.js');
      await loadScript('/showcases/amazon-smt-companion/background.js');

      // Inject Content.css for samurai toast styles inside the showcase
      if (!document.getElementById('smt-content-css')) {
        const link = document.createElement('link');
        link.id = 'smt-content-css';
        link.rel = 'stylesheet';
        link.href = '/showcases/amazon-smt-companion/content.css';
        document.head.appendChild(link);
      }

      // Initial active tab
      if (window.__smt_runtime) {
        window.__smt_runtime.setActiveTab('https://www.amazon.ca');

        // Listen for track changes to update LED/status display and trigger toast
        window.__smt_runtime.onContentMessage((msg: any) => {
          if (msg && msg.type === 'TRACK_CHANGED' && msg.trackName) {
            triggerSamuraiToast(msg.trackName);
            if (statusText) statusText.textContent = msg.trackName;
          }
        });
      }

      // Send initial AMAZON_VISITED message if on Amazon
      if (window.chrome && window.chrome.runtime) {
        window.chrome.runtime.sendMessage({ type: 'AMAZON_VISITED' }, (response: any) => {
          if (response && response.trackName) {
            triggerSamuraiToast(response.trackName);
            if (statusText) statusText.textContent = response.trackName;
          }
        });
      }
    } catch (err) {
      console.error('Failed to boot SMT extension scripts:', err);
    }
  }

  function triggerSamuraiToast(trackName: string) {
    if (currentTab !== 'amazon.ca') return;

    // Remove any existing toast in the showcase
    const existing = root.querySelector('#smt4-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'smt4-toast';
    toast.style.position = 'absolute';
    toast.style.bottom = '16px';
    toast.style.right = '16px';
    toast.style.zIndex = '50';

    const header = document.createElement('div');
    header.className = 'toast-header';
    header.textContent = 'Amazon SMT Music Companion';

    const body = document.createElement('div');
    body.className = 'toast-body';
    body.textContent = trackName ? `Now Playing: ${trackName}` : '';

    toast.appendChild(header);
    toast.appendChild(body);
    viewportAmazon?.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 1000);
    }, 4000);
  }

  function updateTabs(tabId: 'amazon.ca' | 'wikipedia.org' | 'google.com') {
    currentTab = tabId;

    // Update Tab UI
    const allTabs = [
      { id: 'amazon.ca', el: tabAmazon, url: 'https://www.amazon.ca' },
      { id: 'wikipedia.org', el: tabWikipedia, url: 'https://en.wikipedia.org/wiki/Shin_Megami_Tensei' },
      { id: 'google.com', el: tabGoogle, url: 'https://www.google.com/search?q=Shin+Megami+Tensei' }
    ];

    allTabs.forEach(t => {
      if (t.id === tabId) {
        t.el?.classList.add('bg-[#0c0c12]', 'text-accent', 'border-t-2', 'border-accent');
        t.el?.classList.remove('bg-[#141320]', 'text-text-muted');
        if (urlDisplay) urlDisplay.value = t.url;
      } else {
        t.el?.classList.remove('bg-[#0c0c12]', 'text-accent', 'border-t-2', 'border-accent');
        t.el?.classList.add('bg-[#141320]', 'text-text-muted');
      }
    });

    // Viewport switching
    if (viewportAmazon) viewportAmazon.style.display = (tabId === 'amazon.ca') ? 'block' : 'none';
    if (viewportWikipedia) viewportWikipedia.style.display = (tabId === 'wikipedia.org') ? 'block' : 'none';
    if (viewportGoogle) viewportGoogle.style.display = (tabId === 'google.com') ? 'block' : 'none';

    // Update Status LED
    if (statusLed && statusText) {
      if (tabId === 'amazon.ca') {
        statusLed.className = 'w-2 h-2 rounded-full bg-emerald-400 animate-pulse';
        statusText.textContent = 'ONLINE // TARGET DETECTED';
      } else {
        statusLed.className = 'w-2 h-2 rounded-full bg-red-500';
        statusText.textContent = 'OFFLINE // NO TARGET DETECTED';
      }
    }

    // Inform runtime of tab switch
    if (window.__smt_runtime) {
      const activeObj = allTabs.find(t => t.id === tabId);
      window.__smt_runtime.setActiveTab(activeObj?.url);
    }

    // Trigger Amazon visit notification if returning to Amazon
    if (tabId === 'amazon.ca' && window.chrome && window.chrome.runtime) {
      window.chrome.runtime.sendMessage({ type: 'AMAZON_VISITED' }, (res: any) => {
        if (res && res.trackName) {
          triggerSamuraiToast(res.trackName);
        }
      });
    }
  }

  // Event handlers
  const handleTabAmazon = () => updateTabs('amazon.ca');
  const handleTabWikipedia = () => updateTabs('wikipedia.org');
  const handleTabGoogle = () => updateTabs('google.com');

  tabAmazon?.addEventListener('click', handleTabAmazon);
  tabWikipedia?.addEventListener('click', handleTabWikipedia);
  tabGoogle?.addEventListener('click', handleTabGoogle);

  // Toggle Popup
  const handleTogglePopup = (e: MouseEvent) => {
    e.stopPropagation();
    isPopupOpen = !isPopupOpen;
    if (popupContainer) {
      popupContainer.style.display = isPopupOpen ? 'block' : 'none';
    }
    btnPopup?.classList.toggle('ring-2', isPopupOpen);
    btnPopup?.classList.toggle('ring-accent', isPopupOpen);
  };

  btnPopup?.addEventListener('click', handleTogglePopup);

  // Close popup if clicking outside
  const handleDocumentClick = (e: MouseEvent) => {
    if (isPopupOpen && popupContainer && !popupContainer.contains(e.target as Node) && !btnPopup?.contains(e.target as Node)) {
      isPopupOpen = false;
      popupContainer.style.display = 'none';
      btnPopup?.classList.remove('ring-2', 'ring-accent');
    }
  };

  document.addEventListener('click', handleDocumentClick);

  // Autoplay Unlock: First interaction anywhere in showcase unlocks Audio
  const handleFirstInteraction = () => {
    if (window.chrome && window.chrome.runtime) {
      window.chrome.runtime.sendMessage({ type: 'USER_INTERACTED' });
    }
  };

  root.addEventListener('click', handleFirstInteraction, { once: true });

  // Boot the extension
  bootExtension();

  // Astro page transition cleanup
  const handleBeforeSwap = () => {
    // Pause any playing audio
    const audios = document.querySelectorAll('audio');
    audios.forEach(a => a.pause());

    // Teardown runtime
    if (window.__smt_runtime) {
      window.__smt_runtime.teardown();
    }

    // Remove listeners
    tabAmazon?.removeEventListener('click', handleTabAmazon);
    tabWikipedia?.removeEventListener('click', handleTabWikipedia);
    tabGoogle?.removeEventListener('click', handleTabGoogle);
    btnPopup?.removeEventListener('click', handleTogglePopup);
    document.removeEventListener('click', handleDocumentClick);
    document.removeEventListener('astro:before-swap', handleBeforeSwap);
  };

  document.addEventListener('astro:before-swap', handleBeforeSwap, { once: true });
  window.__smt_showcase_cleanup = handleBeforeSwap;
}

// Auto-run when DOM is ready or view transitions complete
if (typeof document !== 'undefined') {
  document.addEventListener('astro:page-load', () => {
    initAmazonSmtShowcase();
  });
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initAmazonSmtShowcase();
  }
}
