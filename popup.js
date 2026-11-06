const input = document.getElementById('enabled');
chrome.storage.sync.get({ enabled: true }, ({ enabled }) => { input.checked = enabled; });
input.addEventListener('change', () => chrome.storage.sync.set({ enabled: input.checked }));
