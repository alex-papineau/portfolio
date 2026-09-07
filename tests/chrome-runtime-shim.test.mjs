import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('WebExtension Runtime Shim Test Suite', async (t) => {
  const shimPath = 'public/showcases/amazon-smt-companion/runtime/chrome-runtime-shim.js';
  assert.ok(fs.existsSync(shimPath), 'Shim file must exist');

  const shimCode = fs.readFileSync(shimPath, 'utf-8');

  function createEnv() {
    const mockWindow = {};
    const fn = new Function('window', shimCode + '; return window.chrome;');
    const chrome = fn(mockWindow);
    return { window: mockWindow, chrome, runtime: mockWindow.__smt_runtime };
  }

  await t.test('storage.local get and set triggers onChanged', async () => {
    const { chrome } = createEnv();
    let changeFired = false;
    let oldVal = null;
    let newVal = null;

    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'local' && changes.volume) {
        changeFired = true;
        oldVal = changes.volume.oldValue;
        newVal = changes.volume.newValue;
      }
    });

    await chrome.storage.local.set({ volume: 80 });
    const data = await chrome.storage.local.get(['volume']);
    assert.equal(data.volume, 80);
    assert.equal(changeFired, true);
    assert.equal(newVal, 80);
  });

  await t.test('storage.session get and set', async () => {
    const { chrome } = createEnv();
    await chrome.storage.session.set({ sessionInitialized: true, shuffleQueue: ['t1', 't2'] });
    const sessionData = await chrome.storage.session.get(['sessionInitialized', 'shuffleQueue']);
    assert.equal(sessionData.sessionInitialized, true);
    assert.deepEqual(sessionData.shuffleQueue, ['t1', 't2']);
  });

  await t.test('runtime messaging routes between sender and receiver with async sendResponse', async () => {
    const { chrome } = createEnv();
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
      if (msg.type === 'PING') {
        setTimeout(() => sendResponse({ status: 'PONG' }), 10);
        return true; // async keep-alive
      }
    });

    const response = await new Promise((resolve) => {
      chrome.runtime.sendMessage({ type: 'PING' }, (resp) => {
        resolve(resp);
      });
    });

    assert.equal(response.status, 'PONG');
  });

  await t.test('port connection lifecycle (popup port and keep-alive)', async () => {
    const { chrome } = createEnv();
    let connectedPortName = null;
    let disconnected = false;

    chrome.runtime.onConnect.addListener((port) => {
      connectedPortName = port.name;
      port.onDisconnect.addListener(() => {
        disconnected = true;
      });
    });

    const port = chrome.runtime.connect({ name: 'popup' });
    assert.equal(connectedPortName, 'popup');
    assert.equal(port.name, 'popup');

    port.disconnect();
    assert.equal(disconnected, true);
  });

  await t.test('tabs.query and tabs.sendMessage route to active tab', async () => {
    const { chrome, runtime } = createEnv();
    runtime.setActiveTab('https://www.amazon.ca');

    const tabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    assert.equal(tabs.length, 1);
    assert.equal(tabs[0].url, 'https://www.amazon.ca');

    let trackReceived = null;
    runtime.onContentMessage((msg) => {
      if (msg.type === 'TRACK_CHANGED') {
        trackReceived = msg.trackName;
      }
    });

    chrome.tabs.sendMessage(tabs[0].id, { type: 'TRACK_CHANGED', trackName: 'Shin Megami Tensei IV - Black Market' });
    assert.equal(trackReceived, 'Shin Megami Tensei IV - Black Market');
  });

  await t.test('windows.getLastFocused returns focused window with active tabs', async () => {
    const { chrome, runtime } = createEnv();
    runtime.setActiveTab('https://www.amazon.ca');

    const win = await new Promise((resolve) => {
      chrome.windows.getLastFocused({ populate: true, windowTypes: ['normal'] }, resolve);
    });

    assert.equal(win.focused, true);
    assert.equal(win.tabs.length, 1);
    assert.equal(win.tabs[0].url, 'https://www.amazon.ca');
  });
});
