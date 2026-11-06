(() => {
  'use strict';

  const HIDDEN_CLASS = 'pokeidle-cleaner-hidden';
  const STYLE_ID = 'pokeidle-cleaner-style';
  const REDEMPTION = /\b(?:resgatou|redeemed)\b/i;
  const REWARDS = [
    /b[oô]nus\s*(?:de\s*)?\+?\s*15\s*%\s*XP\s*Poke\s*Idle/i,
    /b[oô]nus\s*(?:de\s*)?\+?\s*15\s*%\s*Capture\s*Boost/i,
    /b[oô]nus\s*(?:de\s*)?\+?\s*15\s*%\s*Secret\s*Lure/i
  ];
  const ROW_SELECTORS = [
    '[data-chat-entry]', '[data-message-id]', '[data-chat-message-id]',
    '[data-testid="chat-message"]', '[data-testid="message-row"]',
    '[id^="chat-message-"]', '.chat-entry', '.chat-message',
    '.chatroom-message'
  ].join(',');

  let enabled = true;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `.${HIDDEN_CLASS} { display: none !important; }`;
  (document.head || document.documentElement).append(style);

  function normalizedText(el) {
    return (el.textContent || '').replace(/\s+/g, ' ').trim();
  }
  function isRedemption(value) {
    return REDEMPTION.test(value) && REWARDS.some(pattern => pattern.test(value));
  }

  // Identifica uma mensagem individual, nunca a área inteira do chat.
  function findMessageRow(start) {
    if (!(start instanceof Element)) return null;
    let smallestMatch = null;
    let current = start;
    for (let depth = 0; current && depth < 12; depth++, current = current.parentElement) {
      if (current === document.body || current === document.documentElement) break;
      const value = normalizedText(current);
      if (value.length > 650) break;
      if (!isRedemption(value)) continue;
      if (!smallestMatch) smallestMatch = current;
      if (current.matches(ROW_SELECTORS)) return current;
      if ((value.match(/\b(?:resgatou|redeemed)\b/gi) || []).length > 1) break;
    }
    if (!smallestMatch) return null;
    // Sobe até o menor agrupamento que pareça uma linha isolada, incluindo o usuário.
    let row = smallestMatch;
    for (let i = 0; i < 4 && row.parentElement; i++) {
      const parent = row.parentElement;
      if (parent === document.body || parent === document.documentElement) break;
      const text = normalizedText(parent);
      if (text.length > 650 || !isRedemption(text)) break;
      if ((text.match(/\b(?:resgatou|redeemed)\b/gi) || []).length > 1) break;
      if (parent.children.length > 1 && row !== smallestMatch) break;
      row = parent;
    }
    return row;
  }

  function scan(root = document.body) {
    if (!enabled || !root) return;
    const scope = root.nodeType === Node.ELEMENT_NODE ? root : root.parentElement;
    if (!scope || scope.closest?.(`.${HIDDEN_CLASS},script,style,textarea,[contenteditable="true"]`)) return;
    const candidates = [];
    if (REDEMPTION.test(scope.textContent || '') && (scope.textContent || '').length < 650) {
      candidates.push(scope);
    }
    const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        return REDEMPTION.test(node.nodeValue || '')
          ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    });
    while (walker.nextNode()) {
      const parent = walker.currentNode.parentElement;
      if (parent && !parent.closest(`.${HIDDEN_CLASS},script,style,textarea,[contenteditable="true"]`))
        candidates.push(parent);
    }
    for (const candidate of candidates) {
      const row = findMessageRow(candidate);
      if (row) row.classList.add(HIDDEN_CLASS);
    }
  }

  // Sem debounce: não depende de o chat ficar quieto para filtrar resgates.
  const observer = new MutationObserver(mutations => {
    if (!enabled) return;
    const roots = new Set();
    for (const mutation of mutations) {
      if (mutation.type === 'characterData') {
        if (mutation.target.parentElement) roots.add(mutation.target.parentElement);
      } else {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) roots.add(node);
          if (node.nodeType === Node.TEXT_NODE && node.parentElement) roots.add(node.parentElement);
        }
      }
    }
    for (const root of roots) scan(root);
  });

  function setEnabled(next) {
    enabled = Boolean(next);
    document.querySelectorAll(`.${HIDDEN_CLASS}`).forEach(el => el.classList.remove(HIDDEN_CLASS));
    if (enabled) scan();
  }

  chrome.storage.sync.get({enabled:true}, prefs => setEnabled(prefs.enabled));
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync' && changes.enabled) setEnabled(changes.enabled.newValue);
  });
  observer.observe(document.documentElement, {
    childList: true, subtree: true, characterData: true
  });

  // Chrome pode reduzir a atividade em abas inativas. Revarre ao voltar.
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) scan();
  });
  window.addEventListener('focus', () => scan());
  window.addEventListener('pageshow', () => scan());
})();
