/**
 * WebExtension Runtime Shim for Amazon SMT Music Companion
 * 
 * Provides 1:1 compatibility for chrome.storage, chrome.runtime,
 * chrome.tabs, chrome.windows, and chrome.alarms in browser environments.
 */

(function (global) {
  // Check if a parent coordinator runtime already exists (e.g., when loaded in popup iframe)
  let rootRuntime = null;
  try {
    if (global.parent && global.parent !== global && global.parent.__smt_runtime) {
      rootRuntime = global.parent.__smt_runtime;
    }
  } catch (e) {
    // Cross-origin fallback (should not happen on same-origin)
  }

  if (!rootRuntime) {
    const localStorageStore = {
      enabled: true,
      volume: 50,
      track: '',
      repeat: false
    };

    const sessionStorageStore = {
      sessionInitialized: false,
      shuffleQueue: []
    };

    const storageListeners = new Set();
    const runtimeMessageListeners = new Set();
    const runtimeConnectListeners = new Set();
    const contentMessageListeners = new Set();
    const tabActivatedListeners = new Set();
    const tabUpdatedListeners = new Set();
    const tabRemovedListeners = new Set();
    const windowFocusListeners = new Set();
    const alarmListeners = new Set();

    let activeTab = {
      id: 1,
      url: 'https://www.amazon.ca',
      active: true,
      status: 'complete'
    };

    let isWindowFocused = true;

    rootRuntime = {
      localStorageStore,
      sessionStorageStore,
      storageListeners,
      runtimeMessageListeners,
      runtimeConnectListeners,
      contentMessageListeners,
      tabActivatedListeners,
      tabUpdatedListeners,
      tabRemovedListeners,
      windowFocusListeners,
      alarmListeners,
      getActiveTab() {
        return activeTab;
      },
      setActiveTab(url) {
        const prevUrl = activeTab.url;
        activeTab = {
          id: 1,
          url: url || 'https://www.amazon.ca',
          active: true,
          status: 'complete'
        };
        for (const cb of tabActivatedListeners) {
          try { cb({ tabId: 1, windowId: 1 }); } catch (err) { console.error(err); }
        }
        for (const cb of tabUpdatedListeners) {
          try { cb(1, { url: activeTab.url, status: 'complete' }, activeTab); } catch (err) { console.error(err); }
        }
      },
      setWindowFocused(focused) {
        isWindowFocused = !!focused;
        const windowId = isWindowFocused ? 1 : -1;
        for (const cb of windowFocusListeners) {
          try { cb(windowId); } catch (err) { console.error(err); }
        }
      },
      isFocused() {
        return isWindowFocused;
      },
      onContentMessage(cb) {
        contentMessageListeners.add(cb);
        return () => contentMessageListeners.delete(cb);
      },
      teardown() {
        storageListeners.clear();
        runtimeMessageListeners.clear();
        runtimeConnectListeners.clear();
        contentMessageListeners.clear();
        tabActivatedListeners.clear();
        tabUpdatedListeners.clear();
        tabRemovedListeners.clear();
        windowFocusListeners.clear();
        alarmListeners.clear();
      }
    };

    global.__smt_runtime = rootRuntime;
  }

  const {
    localStorageStore,
    sessionStorageStore,
    storageListeners,
    runtimeMessageListeners,
    runtimeConnectListeners,
    contentMessageListeners,
    tabActivatedListeners,
    tabUpdatedListeners,
    tabRemovedListeners,
    windowFocusListeners,
    alarmListeners
  } = rootRuntime;

  function createStorageArea(store, areaName) {
    return {
      get(keys, callback) {
        return new Promise((resolve) => {
          let result = {};
          if (keys === null || keys === undefined) {
            result = { ...store };
          } else if (typeof keys === 'string') {
            result[keys] = store[keys];
          } else if (Array.isArray(keys)) {
            for (const k of keys) {
              if (store[k] !== undefined) {
                result[k] = store[k];
              }
            }
          } else if (typeof keys === 'object') {
            for (const k in keys) {
              result[k] = store[k] !== undefined ? store[k] : keys[k];
            }
          }
          if (typeof callback === 'function') {
            callback(result);
          }
          resolve(result);
        });
      },
      set(items, callback) {
        return new Promise((resolve) => {
          const changes = {};
          for (const key in items) {
            const oldValue = store[key];
            const newValue = items[key];
            if (oldValue !== newValue) {
              store[key] = newValue;
              changes[key] = { oldValue, newValue };
            }
          }

          if (Object.keys(changes).length > 0) {
            for (const cb of storageListeners) {
              try {
                cb(changes, areaName);
              } catch (err) {
                console.error('storage.onChanged listener error:', err);
              }
            }
          }

          if (typeof callback === 'function') {
            callback();
          }
          resolve();
        });
      }
    };
  }

  const chromeMock = {
    storage: {
      local: createStorageArea(localStorageStore, 'local'),
      session: createStorageArea(sessionStorageStore, 'session'),
      onChanged: {
        addListener(cb) {
          storageListeners.add(cb);
        },
        removeListener(cb) {
          storageListeners.delete(cb);
        }
      }
    },
    runtime: {
      lastError: null,
      onInstalled: {
        addListener(cb) {
          setTimeout(() => {
            try { cb({ reason: 'install' }); } catch (e) { console.error(e); }
          }, 0);
        }
      },
      onMessage: {
        addListener(cb) {
          runtimeMessageListeners.add(cb);
        },
        removeListener(cb) {
          runtimeMessageListeners.delete(cb);
        }
      },
      sendMessage(message, callback) {
        return new Promise((resolve) => {
          let isHandled = false;
          let pendingAsync = false;

          const sendResponse = (resp) => {
            isHandled = true;
            if (typeof callback === 'function') {
              callback(resp);
            }
            resolve(resp);
          };

          const sender = { id: 'amazon-smt-music-companion', tab: rootRuntime.getActiveTab() };

          for (const cb of runtimeMessageListeners) {
            try {
              const res = cb(message, sender, sendResponse);
              if (res === true) {
                pendingAsync = true;
              }
            } catch (err) {
              console.error('runtime.onMessage handler error:', err);
            }
          }

          if (!pendingAsync && !isHandled) {
            if (typeof callback === 'function') {
              callback(undefined);
            }
            resolve(undefined);
          }
        });
      },
      connect({ name }) {
        const portDisconnectListeners = new Set();
        const portMessageListeners = new Set();
        const remoteMessageListeners = new Set();

        const clientPort = {
          name,
          postMessage(msg) {
            for (const cb of remoteMessageListeners) {
              try { cb(msg); } catch (err) { console.error(err); }
            }
          },
          onMessage: {
            addListener(cb) {
              portMessageListeners.add(cb);
            },
            removeListener(cb) {
              portMessageListeners.delete(cb);
            }
          },
          onDisconnect: {
            addListener(cb) {
              portDisconnectListeners.add(cb);
            },
            removeListener(cb) {
              portDisconnectListeners.delete(cb);
            }
          },
          disconnect() {
            for (const cb of portDisconnectListeners) {
              try { cb(); } catch (err) { console.error(err); }
            }
          }
        };

        const serverPort = {
          name,
          postMessage(msg) {
            for (const cb of portMessageListeners) {
              try { cb(msg); } catch (err) { console.error(err); }
            }
          },
          onMessage: {
            addListener(cb) {
              remoteMessageListeners.add(cb);
            },
            removeListener(cb) {
              remoteMessageListeners.delete(cb);
            }
          },
          onDisconnect: clientPort.onDisconnect,
          disconnect: clientPort.disconnect
        };

        for (const cb of runtimeConnectListeners) {
          try {
            cb(serverPort);
          } catch (err) {
            console.error('runtime.onConnect listener error:', err);
          }
        }

        return clientPort;
      },
      onConnect: {
        addListener(cb) {
          runtimeConnectListeners.add(cb);
        },
        removeListener(cb) {
          runtimeConnectListeners.delete(cb);
        }
      }
    },
    tabs: {
      query(queryInfo, callback) {
        return new Promise((resolve) => {
          const tab = rootRuntime.getActiveTab();
          const result = [tab];
          if (typeof callback === 'function') {
            callback(result);
          }
          resolve(result);
        });
      },
      sendMessage(tabId, message, callback) {
        return new Promise((resolve) => {
          for (const cb of contentMessageListeners) {
            try {
              cb(message);
            } catch (err) {
              console.error('tabs.sendMessage content listener error:', err);
            }
          }
          if (typeof callback === 'function') {
            callback({ success: true });
          }
          resolve({ success: true });
        });
      },
      onActivated: {
        addListener(cb) {
          tabActivatedListeners.add(cb);
        },
        removeListener(cb) {
          tabActivatedListeners.delete(cb);
        }
      },
      onUpdated: {
        addListener(cb) {
          tabUpdatedListeners.add(cb);
        },
        removeListener(cb) {
          tabUpdatedListeners.delete(cb);
        }
      },
      onRemoved: {
        addListener(cb) {
          tabRemovedListeners.add(cb);
        },
        removeListener(cb) {
          tabRemovedListeners.delete(cb);
        }
      }
    },
    windows: {
      WINDOW_ID_NONE: -1,
      getLastFocused(queryInfo, callback) {
        return new Promise((resolve) => {
          const focused = rootRuntime.isFocused();
          const tab = rootRuntime.getActiveTab();
          const win = {
            id: 1,
            focused,
            type: 'normal',
            tabs: (queryInfo && queryInfo.populate) ? [tab] : undefined
          };
          if (typeof callback === 'function') {
            callback(win);
          }
          resolve(win);
        });
      },
      onFocusChanged: {
        addListener(cb) {
          windowFocusListeners.add(cb);
        },
        removeListener(cb) {
          windowFocusListeners.delete(cb);
        }
      }
    },
    alarms: {
      create(name, alarmInfo) {},
      onAlarm: {
        addListener(cb) {
          alarmListeners.add(cb);
        },
        removeListener(cb) {
          alarmListeners.delete(cb);
        }
      }
    }
  };

  global.chrome = chromeMock;
  global.browser = chromeMock;
})(typeof window !== 'undefined' ? window : globalThis);
