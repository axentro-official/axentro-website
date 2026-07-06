/* ============================================
   Axentro AI Assistant - JavaScript
   Version: 1.0.3 (Production - Retry & Validation Finalized)
   Architecture: IIFE, Zero innerHTML, Safe DOM APIs
   ============================================ */

(function () {
  'use strict';

  // --- 1. CONSTANTS & CONFIG ---
  const API_URL = 'https://axentro-ai-assistant.axentroofficial.workers.dev/';
  const SESSION_KEY = 'axentro_ai_session';
  const SESSION_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes
  const MAX_MSG_LENGTH = 1500;
  const MAX_HISTORY_TURNS = 5; // 5 pairs = 10 elements max
  const MAX_SESSION_MSGS = 20;
  const TIMEOUT_MS = 30000;

  // --- 2. STATE ---
  const state = {
    isOpen: false,
    isSending: false,
    messages: [],
    lastActivity: Date.now(),
    currentLanguage: 'ar',
    activeRequest: null,
    pendingRetryContext: null,
    qualification: null, // PHASE B
    abortReason: null
  };

  // --- 3. DICTIONARIES (i18n) ---
  const i18n = {
    ar: {
      title: 'Axentro AI',
      status: 'متصل',
      welcome: 'مرحبًا 👋\nأنا مساعد Axentro الذكي.\nيمكنني مساعدتك في فهم خدماتنا واختيار الحل الأنسب لمشروعك.',
      placeholder: 'اكتب رسالتك...',
      send: 'إرسال',
      close: 'إغلاق',
      typing: 'يكتب...',
      error_busy: 'الخدمة الذكية مشغولة مؤقتًا. حاول مرة أخرى بعد لحظات.',
      error_offline: 'لا يوجد اتصال بالإنترنت. يرجى التحقق من اتصالك.',
      error_generic: 'عذراً، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
      retry: 'إعادة المحاولة',
      dismiss: 'تجاهل',
      quick_actions: ['أريد إنشاء موقع', 'أحتاج نظام إدارة', 'لدي فكرة مشروع', 'ما خدمات Axentro؟'],
      wa_cta: 'متابعة المشروع على واتساب',
      wa_summary: 'مرحبًا Axentro،\nتحدثت مع المساعد الذكي وأرغب في مناقشة مشروعي.'
    },
    en: {
      title: 'Axentro AI',
      status: 'Online',
      welcome: "Hello 👋\nI'm the Axentro AI Assistant.\nI can help you understand our services and choose the right solution for your project.",
      placeholder: 'Type your message...',
      send: 'Send',
      close: 'Close',
      typing: 'Typing...',
      error_busy: 'The AI service is temporarily busy. Please try again in a moment.',
      error_offline: 'No internet connection. Please check your connection.',
      error_generic: 'Sorry, an unexpected error occurred. Please try again.',
      retry: 'Retry',
      dismiss: 'Dismiss',
      quick_actions: ['I need a website', 'I need a management system', 'I have a project idea', 'What services does Axentro offer?'],
      wa_cta: 'Continue on WhatsApp',
      wa_summary: "Hello Axentro,\nI spoke with the AI Assistant and I'd like to discuss my project."
    }
  };

  // --- 4. DOM ELEMENTS ---
  let fab, panel, headerTitle, headerStatus, closeBtn, body, composer, textarea, sendBtn;
  let isComposing = false;

  // --- 5. DOM INITIALIZATION (Zero innerHTML) ---
  function initDOM() {
    fab = document.createElement('button');
    fab.className = 'ax-ai-fab';
    fab.setAttribute('aria-label', 'Open AI Assistant');
    fab.setAttribute('aria-expanded', 'false');
    fab.setAttribute('aria-controls', 'ax-ai-panel');
    const fabIcon = document.createElement('i');
    fabIcon.className = 'fas fa-robot';
    fab.appendChild(fabIcon);
    fab.addEventListener('click', togglePanel);

    panel = document.createElement('div');
    panel.className = 'ax-ai-panel';
    panel.id = 'ax-ai-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-labelledby', 'ax-ai-title');
    panel.setAttribute('aria-hidden', 'true');
    panel.setAttribute('inert', '');

    const header = document.createElement('div');
    header.className = 'ax-ai-header';
    const headerInfo = document.createElement('div');
    headerInfo.className = 'ax-ai-header-info';
    headerTitle = document.createElement('div');
    headerTitle.className = 'ax-ai-title';
    headerTitle.id = 'ax-ai-title';
    headerStatus = document.createElement('div');
    headerStatus.className = 'ax-ai-status';
    headerInfo.appendChild(headerTitle);
    headerInfo.appendChild(headerStatus);
    closeBtn = document.createElement('button');
    closeBtn.className = 'ax-ai-close';
    closeBtn.setAttribute('aria-label', 'Close');
    const closeIcon = document.createElement('i');
    closeIcon.className = 'fas fa-times';
    closeBtn.appendChild(closeIcon);
    closeBtn.addEventListener('click', closePanel);
    header.appendChild(headerInfo);
    header.appendChild(closeBtn);

    body = document.createElement('div');
    body.className = 'ax-ai-body';

    composer = document.createElement('div');
    composer.className = 'ax-ai-composer';
    textarea = document.createElement('textarea');
    textarea.className = 'ax-ai-textarea';
    textarea.setAttribute('maxlength', MAX_MSG_LENGTH);
    textarea.setAttribute('rows', '1');
    textarea.addEventListener('input', handleTextareaInput);
    textarea.addEventListener('keydown', handleTextareaKeydown);
    textarea.addEventListener('compositionstart', () => { isComposing = true; });
    textarea.addEventListener('compositionend', () => { isComposing = false; });
    sendBtn = document.createElement('button');
    sendBtn.className = 'ax-ai-send-btn';
    sendBtn.setAttribute('aria-label', 'Send');
    const sendIcon = document.createElement('i');
    sendIcon.className = 'fas fa-paper-plane';
    sendBtn.appendChild(sendIcon);
    sendBtn.addEventListener('click', submitCurrentInput);
    composer.appendChild(textarea);
    composer.appendChild(sendBtn);

    panel.appendChild(header);
    panel.appendChild(body);
    panel.appendChild(composer);

    document.body.appendChild(fab);
    document.body.appendChild(panel);

    document.addEventListener('keydown', handleGlobalKeydown);
    window.addEventListener('pagehide', handlePageHide);
  }

  // --- 6. LANGUAGE & OBSERVER ---
  function syncLanguage() {
    const lang = document.documentElement.lang === 'en' ? 'en' : 'ar';
    const changed = state.currentLanguage !== lang;
    state.currentLanguage = lang;
    
    const dict = i18n[lang];
    headerTitle.textContent = dict.title;
    headerStatus.replaceChildren();
    const statusDot = document.createElement('span');
    statusDot.className = 'ax-ai-status-dot';
    headerStatus.appendChild(statusDot);
    headerStatus.appendChild(document.createTextNode(dict.status));
    textarea.setAttribute('placeholder', dict.placeholder);
    sendBtn.setAttribute('aria-label', dict.send);
    closeBtn.setAttribute('aria-label', dict.close);
    
    if (changed) {
      renderMessages();
    }
  }

  function setupObserver() {
    const observer = new MutationObserver(() => syncLanguage());
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['lang', 'dir']
    });
  }

  // --- 7. SESSION MANAGEMENT ---
  function loadSession() {
    let sessionWasNormalized = false;
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      
      if (typeof data !== 'object' || data === null) throw new Error('Invalid schema');
      if (!Array.isArray(data.messages) || typeof data.lastActivity !== 'number' || !isFinite(data.lastActivity)) throw new Error('Invalid schema');
      if (Date.now() - data.lastActivity > SESSION_EXPIRY_MS) throw new Error('Expired');
      
      state.messages = data.messages.reduce((acc, msg) => {
        if (!msg || typeof msg !== 'object') return acc;
        if (!['user', 'assistant'].includes(msg.role)) return acc;
        if (msg.type !== 'chat') return acc;
        if (typeof msg.text !== 'string' || msg.text.length === 0) return acc;
        if (msg.role === 'user' && msg.text.length > MAX_MSG_LENGTH) return acc;
        if (typeof msg.id !== 'string') return acc;
        if (typeof msg.timestamp !== 'number' || !isFinite(msg.timestamp)) return acc;
        
        let status = msg.status;
        if (!['completed', 'failed'].includes(status)) {
          if (status === 'pending') {
            status = 'failed';
            sessionWasNormalized = true;
          } else {
            return acc;
          }
        }
        
        acc.push({
          id: msg.id,
          role: msg.role,
          text: msg.text,
          timestamp: msg.timestamp,
          type: 'chat',
          status: status
        });
        return acc;
      }, []).slice(-MAX_SESSION_MSGS);
      
      state.lastActivity = data.lastActivity;
      
      if (sessionWasNormalized) {
        saveSession();
      }
      renderMessages();
    } catch (e) {
      sessionStorage.removeItem(SESSION_KEY);
    }
  }

  function saveSession() {
    try {
      const data = {
        messages: state.messages.slice(-MAX_SESSION_MSGS),
        lastActivity: state.lastActivity
      };
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save AI session:', e);
    }
  }

  // --- 8. HISTORY CONSTRUCTION ---
  function buildApiHistory() {
    const completed = state.messages.filter(
      m => m.type === 'chat' && m.status === 'completed'
    );
    
    const turns = [];
    for (let i = 0; i < completed.length - 1; i++) {
      if (completed[i].role === 'user' && completed[i+1].role === 'assistant') {
        turns.push([completed[i], completed[i+1]]);
        i++;
      }
    }
    
    const lastTurns = turns.slice(-MAX_HISTORY_TURNS);
    const history = [];
    lastTurns.forEach(turn => {
      history.push({ role: 'user', text: turn[0].text });
      history.push({ role: 'assistant', text: turn[1].text });
    });
    
    return history;
  }

  // --- 9. MESSAGE RENDERING ---
  function renderMessages() {
    body.replaceChildren();
    const dict = i18n[state.currentLanguage];
    let hasAssistantReply = false;

    const welcomeMsg = { type: 'welcome', text: dict.welcome };
    body.appendChild(createMessageElement(welcomeMsg));

    state.messages.forEach(msg => {
      body.appendChild(createMessageElement(msg));
      if (msg.role === 'assistant' && msg.status === 'completed') {
        hasAssistantReply = true;
      }
    });

    if (state.messages.length === 0) {
      body.appendChild(createQuickActions());
    }

    if (hasAssistantReply) {
      body.appendChild(createWhatsAppCTA());
    }

    if (state.pendingRetryContext && !state.pendingRetryContext.retryInProgress) {
      body.appendChild(createErrorElement(state.pendingRetryContext.errorType));
    }

    scrollToBottom();
  }

  function createMessageElement(msg) {
    const div = document.createElement('div');
    
    if (msg.type === 'welcome') {
      div.className = 'ax-ai-msg ax-ai-msg--bot';
      div.textContent = msg.text;
      return div;
    }

    div.className = `ax-ai-msg ax-ai-msg--${msg.role === 'user' ? 'user' : 'bot'}`;
    div.textContent = msg.text;
    
    if (msg.role === 'user' && msg.status === 'pending') {
      div.style.opacity = '0.6';
    }
    if (msg.role === 'user' && msg.status === 'failed') {
      div.style.opacity = '0.4';
    }
    
    return div;
  }

  function createErrorElement(errorType) {
    const dict = i18n[state.currentLanguage];
    let text = dict.error_generic;
    if (errorType === 'TimeoutError' || errorType === 'HttpError503' || errorType === 'HttpError502') {
      text = dict.error_busy;
    } else if (errorType === 'Offline') {
      text = dict.error_offline;
    }

    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.gap = '10px';

    const errorDiv = document.createElement('div');
    errorDiv.className = 'ax-ai-msg ax-ai-msg--error';
    errorDiv.textContent = text;
    container.appendChild(errorDiv);

    const retryBtn = document.createElement('button');
    retryBtn.className = 'ax-ai-quick-btn';
    retryBtn.textContent = dict.retry;
    retryBtn.addEventListener('click', manualRetry);
    container.appendChild(retryBtn);

    const dismissBtn = document.createElement('button');
    dismissBtn.className = 'ax-ai-quick-btn';
    dismissBtn.textContent = dict.dismiss;
    dismissBtn.addEventListener('click', dismissError);
    container.appendChild(dismissBtn);

    return container;
  }

  function createQuickActions() {
    const container = document.createElement('div');
    container.className = 'ax-ai-quick-actions';
    i18n[state.currentLanguage].quick_actions.forEach(text => {
      const btn = document.createElement('button');
      btn.className = 'ax-ai-quick-btn';
      btn.textContent = text;
      btn.addEventListener('click', () => {
        if (!state.isSending && !state.pendingRetryContext) {
          sendMessage(text);
        }
      });
      container.appendChild(btn);
    });
    return container;
  }

  function createWhatsAppCTA() {
    const link = document.createElement('a');
    link.className = 'ax-ai-wa-btn';
    link.href = '#';
    const icon = document.createElement('i');
    icon.className = 'fab fa-whatsapp';
    link.appendChild(icon);
    link.appendChild(document.createTextNode(' ' + i18n[state.currentLanguage].wa_cta));
    
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof window.whatsapp === 'function') {
        window.whatsapp('ai_assistant', i18n[state.currentLanguage].wa_summary);
        if (typeof window.trackClick === 'function') {
          window.trackClick('ai_assistant', 'WhatsApp CTA Click', 'ai_assistant');
        }
      }
    });
    return link;
  }

  function updateMessageStatusInState(id, status) {
    const msgIndex = state.messages.findIndex(m => m.id === id);
    if (msgIndex !== -1) {
      state.messages[msgIndex].status = status;
    }
  }

  function showTyping() {
    let typing = document.getElementById('ax-ai-typing');
    if (!typing) {
      typing = document.createElement('div');
      typing.className = 'ax-ai-typing';
      typing.id = 'ax-ai-typing';
      for (let i = 0; i < 3; i++) {
        const dot = document.createElement('span');
        dot.className = 'ax-ai-typing-dot';
        typing.appendChild(dot);
      }
      body.appendChild(typing);
      scrollToBottom();
    }
  }

  function hideTyping() {
    const typing = document.getElementById('ax-ai-typing');
    if (typing) typing.remove();
  }

  // --- 10. CORE SEND FLOW ---
  function submitCurrentInput() {
    if (state.isSending || state.pendingRetryContext) return;
    const text = textarea.value.trim();
    if (!text || text.length > MAX_MSG_LENGTH) return;
    
    textarea.value = '';
    textarea.style.height = 'auto';
    sendMessage(text);
  }

  function sendMessage(text) {
    const history = buildApiHistory();

    const userMsg = {
      id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      role: 'user',
      text: text,
      timestamp: Date.now(),
      type: 'chat',
      status: 'pending'
    };

    state.messages.push(userMsg);
    state.lastActivity = Date.now();
    
    state.isSending = true;
    lockComposer();

    renderMessages();
    saveSession();

    fetchData(text, history, userMsg.id, false);
  }

  async function fetchData(message, history, userMsgId, isRetryAttempt) {
    showTyping();
    const controller = new AbortController();
    state.activeRequest = controller;
    state.abortReason = null;

    const timeoutId = setTimeout(() => {
      state.abortReason = 'timeout';
      controller.abort();
    }, TIMEOUT_MS);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw { name: 'HttpError', status: response.status };
      }

      const data = await response.json();
      
      // STRICT RESPONSE VALIDATION
      if (
        typeof data !== 'object' || data === null ||
        data.ok !== true ||
        typeof data.reply !== 'string' ||
        data.reply.trim().length === 0
      ) {
        throw { name: 'MalformedError' };
      }

      // SUCCESS FLOW
      hideTyping();
      updateMessageStatusInState(userMsgId, 'completed');
      state.pendingRetryContext = null;
      
      const assistantMsg = {
        id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        role: 'assistant',
        text: data.reply, // Safe string
        timestamp: Date.now(),
        type: 'chat',
        status: 'completed'
      };
      state.messages.push(assistantMsg);
      state.lastActivity = Date.now();
      
      renderMessages();
      saveSession();

      if (typeof window.trackClick === 'function') {
        window.trackClick('ai_assistant', 'Message Sent', 'ai_assistant');
      }

    } catch (error) {
      clearTimeout(timeoutId);
      hideTyping();

      if (error.name === 'AbortError') {
        if (state.abortReason === 'navigation') return;
        if (state.abortReason === 'timeout') {
          handleError({ name: 'TimeoutError' }, message, history, userMsgId);
          return;
        }
      }

      if (error.name === 'HttpError') {
        handleError(error, message, history, userMsgId);
        return;
      }

      handleError({ name: error.name || 'NetworkError' }, message, history, userMsgId);

    } finally {
      state.activeRequest = null;
      if (state.abortReason !== 'navigation') {
        if (state.pendingRetryContext && state.pendingRetryContext.retryInProgress) {
          state.isSending = true;
        } else {
          state.isSending = false;
          if (!state.pendingRetryContext) {
            unlockComposer();
          }
        }
      }
    }
  }

  // --- 11. ERROR & RETRY HANDLING ---
  function handleError(error, message, history, userMsgId) {
    let errorType = 'GenericError';
    let shouldAutoRetry = false;

    if (!navigator.onLine) {
      errorType = 'Offline';
    } else if (error.name === 'TimeoutError') {
      errorType = 'TimeoutError';
      shouldAutoRetry = true;
    } else if (error.name === 'HttpError') {
      errorType = 'HttpError' + error.status;
      if (error.status === 502 || error.status === 503) {
        shouldAutoRetry = true;
      }
    } else if (error.name === 'MalformedError') {
      errorType = 'MalformedError';
    } else {
      errorType = 'NetworkError';
    }

    if (!state.pendingRetryContext) {
      state.pendingRetryContext = {
        userMessageId: userMsgId,
        message: message,
        history: history,
        errorType: errorType,
        autoRetryUsed: false,
        retryInProgress: false
      };
    } else {
      state.pendingRetryContext.errorType = errorType;
    }

    updateMessageStatusInState(userMsgId, 'failed');

    if (shouldAutoRetry && !state.pendingRetryContext.autoRetryUsed) {
      state.pendingRetryContext.autoRetryUsed = true;
      state.pendingRetryContext.retryInProgress = true;
      
      updateMessageStatusInState(userMsgId, 'pending');
      renderMessages();
      showTyping();
      
      setTimeout(() => {
        if (state.pendingRetryContext && state.pendingRetryContext.retryInProgress) {
          fetchData(message, history, userMsgId, true);
        }
      }, 1500);
    } else {
      state.pendingRetryContext.retryInProgress = false;
      renderMessages();
      lockComposerForRetry();
    }
  }

  function manualRetry() {
    if (!state.pendingRetryContext) return;
    const { message, history, userMessageId } = state.pendingRetryContext;
    
    state.pendingRetryContext.autoRetryUsed = true; // Consume budget permanently
    state.pendingRetryContext.retryInProgress = true;
    updateMessageStatusInState(userMessageId, 'pending');
    renderMessages();
    showTyping();
    
    state.isSending = true;
    lockComposer();
    fetchData(message, history, userMessageId, true);
  }

  function dismissError() {
    if (!state.pendingRetryContext) return;
    state.pendingRetryContext = null;
    state.isSending = false;
    renderMessages();
    unlockComposer();
  }

  // --- 12. UI UTILITIES ---
  function togglePanel() {
    state.isOpen ? closePanel() : openPanel();
  }

  function openPanel() {
    state.isOpen = true;
    panel.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
    panel.removeAttribute('inert');
    fab.setAttribute('aria-expanded', 'true');
    setTimeout(() => textarea.focus(), 300);
    if (typeof window.trackClick === 'function') {
      window.trackClick('ai_assistant', 'Open AI Widget', 'ai_assistant');
    }
  }

  function closePanel() {
    state.isOpen = false;
    panel.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
    panel.setAttribute('inert', '');
    fab.setAttribute('aria-expanded', 'false');
    fab.focus();
  }

  function lockComposer() {
    textarea.setAttribute('readOnly', 'true');
    sendBtn.disabled = true;
  }

  function lockComposerForRetry() {
    textarea.setAttribute('readOnly', 'true');
    sendBtn.disabled = true;
    textarea.value = '';
  }

  function unlockComposer() {
    textarea.removeAttribute('readOnly');
    sendBtn.disabled = false;
    textarea.focus();
  }

  function handleTextareaInput() {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  }

  function handleTextareaKeydown(e) {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      submitCurrentInput();
    }
  }

  function handleGlobalKeydown(e) {
    if (e.key === 'Escape' && state.isOpen) {
      closePanel();
    }
  }

  function handlePageHide() {
    if (state.activeRequest) {
      state.abortReason = 'navigation';
      state.activeRequest.abort();
    }
  }

  function scrollToBottom() {
    body.scrollTop = body.scrollHeight;
  }

  // --- 13. INITIALIZATION ---
  document.addEventListener('DOMContentLoaded', () => {
    initDOM();
    loadSession();
    syncLanguage();
    setupObserver();
  });

})();
