/* ══════════════════════════════════════════════
   OFFICE OF CONGRESSMAN ROY M. GONZALES
   LONE DISTRICT OF SANTA ROSA, LAGUNA
   INTERACTION ENGINE (Emil Kowalski Craft & Physics)
══════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ──────────────────────────────────────────────
     1. TOAST NOTIFICATION SYSTEM (SONNER-STYLE)
  ────────────────────────────────────────────── */
  var toastContainer = document.getElementById('toastContainer');

  function showToast(message, type) {
    if (!toastContainer) return;
    
    var toast = document.createElement('div');
    toast.className = 'sonner-toast';
    toast.setAttribute('role', 'status');

    var indicatorHtml = '<span class="toast-indicator toast-indicator-' + (type === 'info' ? 'info' : 'success') + '" aria-hidden="true"></span>';
    toast.innerHTML = indicatorHtml + '<span>' + message + '</span>';

    toastContainer.appendChild(toast);

    // Auto-dismiss after 2.8s with spring exit
    setTimeout(function () {
      toast.classList.add('toast-dismissing');
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 220);
    }, 2800);
  }

  /* ──────────────────────────────────────────────
     2. SLIDING PILL TAB NAVIGATION (EMIL KOWALSKI)
  ────────────────────────────────────────────── */
  var navTrack = document.getElementById('navTrack');
  var navActivePill = document.getElementById('navActivePill');
  var tabButtons = document.querySelectorAll('.nav-tab-btn');
  var viewPanels = document.querySelectorAll('.view-panel');

  function updatePillPosition(activeBtn) {
    if (!activeBtn || !navActivePill) return;
    var left = activeBtn.offsetLeft;
    var width = activeBtn.offsetWidth;
    var scale = width / 100;
    navActivePill.style.transform = 'translate3d(' + left + 'px, 0, 0) scaleX(' + scale + ')';
  }

  function switchView(targetPageId) {
    var currentPanel = document.querySelector('.view-panel.active');
    var targetPanel = document.getElementById('page-' + targetPageId);
    if (!targetPanel || currentPanel === targetPanel) return;

    var targetBtn = document.querySelector('.nav-tab-btn[data-page="' + targetPageId + '"]');

    // Update active tab button state
    tabButtons.forEach(function (btn) {
      btn.classList.remove('active');
      btn.removeAttribute('aria-current');
    });

    if (targetBtn) {
      targetBtn.classList.add('active');
      targetBtn.setAttribute('aria-current', 'page');
      updatePillPosition(targetBtn);
    }

    // Smooth view transition
    if (currentPanel) {
      currentPanel.classList.remove('visible');
      setTimeout(function () {
        currentPanel.classList.remove('active');
        targetPanel.classList.add('active');

        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            targetPanel.classList.add('visible');
            if (targetPageId === 'home') {
              animateAllCounters();
            }
          });
        });
      }, 180);
    } else {
      targetPanel.classList.add('active', 'visible');
    }
  }

  // Attach click listener to tab buttons
  tabButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var pageId = this.getAttribute('data-page');
      switchView(pageId);
    });
  });

  // Support internal buttons switching tabs (e.g. "View District Services")
  document.querySelectorAll('[data-target-page], [data-nav-to]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      var targetId = this.getAttribute('data-target-page') || this.getAttribute('data-nav-to');
      if (targetId) {
        switchView(targetId);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  // Initial pill positioning
  window.addEventListener('load', function () {
    var initialActive = document.querySelector('.nav-tab-btn.active');
    if (initialActive) updatePillPosition(initialActive);
  });

  window.addEventListener('resize', function () {
    var activeBtn = document.querySelector('.nav-tab-btn.active');
    if (activeBtn) updatePillPosition(activeBtn);
  });

  /* ──────────────────────────────────────────────
     3. EXPONENTIAL EASED TABULAR COUNTERS
  ────────────────────────────────────────────── */
  var countersDone = false;

  function easeOutExpo(x) {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
  }

  function animateCounter(el, target, durationMs, suffix) {
    if (!el) return;
    suffix = suffix || '';
    var start = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      var elapsed = timestamp - start;
      var progress = Math.min(elapsed / durationMs, 1);
      var eased = easeOutExpo(progress);
      var currentVal = Math.floor(eased * target);

      el.textContent = currentVal.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString() + suffix;
      }
    }
    requestAnimationFrame(step);
  }

  function animateAllCounters() {
    if (countersDone) return;
    var statEls = document.querySelectorAll('.stat-number');
    statEls.forEach(function (el) {
      var target = parseInt(el.getAttribute('data-target'), 10) || 0;
      var suffix = el.getAttribute('data-suffix') || '';
      animateCounter(el, target, 1800, suffix);
    });
    countersDone = true;
  }

  // Trigger counters with intersection observer
  var kpiLedger = document.querySelector('.kpi-ledger');
  if (kpiLedger && 'IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateAllCounters();
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    counterObserver.observe(kpiLedger);
  } else {
    setTimeout(animateAllCounters, 350);
  }

  /* ──────────────────────────────────────────────
     4. VAUL-INSPIRED COMMAND DRAWER & SEARCH ENGINE
  ────────────────────────────────────────────── */
  var drawer = document.getElementById('scholarshipDrawer');
  var overlay = document.getElementById('drawerOverlay');
  var closeBtn = document.getElementById('closeDrawer');
  var openBtns = document.querySelectorAll('.open-drawer-btn');
  var searchInput = document.getElementById('searchInput');
  var clearBtn = document.getElementById('clearButton');
  var resultsEl = document.getElementById('results');
  var resultsCountEl = document.getElementById('resultsCount');
  var totalCountEl = document.getElementById('totalCount');

  var applicants = [];
  var lastFocusedElement = null;

  function openDrawer() {
    if (!drawer) return;
    lastFocusedElement = document.activeElement;
    drawer.classList.add('active');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Auto-focus search input with smooth delay
    setTimeout(function () {
      if (searchInput) searchInput.focus();
    }, 150);

    if (applicants.length > 0 && totalCountEl && totalCountEl.textContent === '0') {
      animateCounter(totalCountEl, applicants.length, 1200);
    }
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';

    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  }

  openBtns.forEach(function (btn) {
    btn.addEventListener('click', openDrawer);
  });

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  // Global Keyboard Shortcuts (/ or Ctrl+K to open, Esc to close)
  document.addEventListener('keydown', function (e) {
    // If Esc pressed and drawer is open
    if (e.key === 'Escape' && drawer && drawer.classList.contains('active')) {
      e.preventDefault();
      closeDrawer();
      return;
    }

    // If '/' or 'Ctrl+K' / 'Cmd+K' pressed to search
    var isTypingInField = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA';
    if (!isTypingInField && (e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'))) {
      e.preventDefault();
      openDrawer();
    }
  });

  /* ──────────────────────────────────────────────
     5. APPLICANTS DATA FETCHING & FORMATTING
  ────────────────────────────────────────────── */
  function formatName(p) {
    var last = (p.last_name || '').trim().toUpperCase();
    var first = (p.first_name || '').trim().toUpperCase();
    var middle = (p.middle_name || '').trim();
    var mi = middle
      ? middle.split(/\s+/).filter(Boolean).map(function (s) { return s.charAt(0).toUpperCase() + '.'; }).join(' ')
      : '';
    return last + ', ' + first + (mi ? ' ' + mi : '');
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, function (m) {
      switch (m) {
        case '&': return '&amp;';
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '"': return '&quot;';
        case "'": return '&#039;';
        default: return m;
      }
    });
  }

  function highlightMatch(text, query) {
    if (!query) return escapeHtml(text);
    var reg = new RegExp('(' + query.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') + ')', 'gi');
    return escapeHtml(text).replace(reg, '<mark class="highlight-match">$1</mark>');
  }

  function showInitialEmptyState() {
    if (!resultsEl) return;
    resultsEl.innerHTML = 
      '<div class="empty-state-card">' +
        '<h4 class="empty-state-title">Search Qualified Masterlist</h4>' +
        '<p class="empty-state-text">Enter at least 4 characters of your Last Name, First Name, or exact Student Number to verify qualification.</p>' +
      '</div>';
    if (resultsCountEl) resultsCountEl.textContent = 'Ready to search';
  }

  function renderApplicantList(list, query) {
    if (!resultsEl) return;

    if (!list.length) {
      resultsEl.innerHTML = 
        '<div class="no-results-card">' +
          '<h4 class="empty-state-title">No Endorsed Record Found</h4>' +
          '<p class="empty-state-text">No matching records found for "<strong>' + escapeHtml(query) + '</strong>". Please check your spelling or contact the District Congressional Office if your application was recently submitted.</p>' +
        '</div>';
      if (resultsCountEl) resultsCountEl.textContent = '0 matches found';
      return;
    }

    var displayList = list.slice(0, 60);
    var html = displayList.map(function (person, i) {
      var fullName = formatName(person);
      var highlightedName = highlightMatch(fullName, query);

      return '<article class="applicant-card" style="animation-delay:' + (i * 0.025) + 's">' +
        '<div class="applicant-info">' +
          '<h5 class="applicant-name">' + highlightedName + '</h5>' +
          '<div class="applicant-meta-row">' +
            '<span class="applicant-status-tag"><span class="applicant-status-dot" aria-hidden="true"></span>CHED TDP Endorsed Scholar • AY 2026–2027</span>' +
          '</div>' +
        '</div>' +
        '<span class="badge-qualified">' +
          '<span class="badge-qualified-dot" aria-hidden="true"></span>' +
          '<span>Qualified</span>' +
        '</span>' +
      '</article>';
    }).join('');

    resultsEl.innerHTML = html;

    if (resultsCountEl) {
      var totalMatches = list.length;
      resultsCountEl.textContent = totalMatches === 1 ? '1 verified match' : totalMatches.toLocaleString() + ' verified matches';
    }
  }

  // Load applicants.json data
  fetch('applicants.json')
    .then(function (res) {
      if (!res.ok) throw new Error('Data fetch failed');
      return res.json();
    })
    .then(function (data) {
      applicants = Array.isArray(data) ? data : [];
      if (totalCountEl) {
        animateCounter(totalCountEl, applicants.length, 1200);
      }
      showInitialEmptyState();
    })
    .catch(function () {
      if (resultsEl) {
        resultsEl.innerHTML = '<div class="no-results-card"><p>Unable to connect to local masterlist. If running locally, please open via a local server (e.g. python -m http.server).</p></div>';
      }
    });

  // Debounced search logic
  var searchTimeout = null;

  function performSearch(query) {
    if (!query || query.length < 4) {
      showInitialEmptyState();
      return;
    }

    var norm = query.toLowerCase().trim();

    // Exact student ID check
    var exactIdMatches = applicants.filter(function (p) {
      return (p.student_num || '').toLowerCase().trim() === norm;
    });

    if (exactIdMatches.length > 0) {
      renderApplicantList(exactIdMatches, query);
      return;
    }

    // Partial ID or name match
    var partialMatches = applicants.filter(function (p) {
      var sNum = (p.student_num || '').toLowerCase();
      var fName = (p.first_name || '').toLowerCase();
      var mName = (p.middle_name || '').toLowerCase();
      var lName = (p.last_name || '').toLowerCase();
      var fullName = lName + ' ' + fName + ' ' + mName;

      return sNum.includes(norm) || fullName.includes(norm);
    });

    renderApplicantList(partialMatches, query);
  }

  if (searchInput) {
    searchInput.addEventListener('input', function (e) {
      var query = e.target.value;
      if (clearBtn) clearBtn.hidden = !query;

      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(function () {
        performSearch(query);
      }, 140);
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      if (searchInput) {
        searchInput.value = '';
        clearBtn.hidden = true;
        showInitialEmptyState();
        searchInput.focus();
      }
    });
  }


  /* ──────────────────────────────────────────────
     6. MILESTONE LEDGER CATEGORY FILTERING
  ────────────────────────────────────────────── */
  var filterChips = document.querySelectorAll('.filter-chip');
  var ledgerEntries = document.querySelectorAll('.ledger-entry');

  filterChips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var filter = this.getAttribute('data-filter');

      filterChips.forEach(function (c) { c.classList.remove('active'); });
      this.classList.add('active');

      ledgerEntries.forEach(function (entry) {
        var category = entry.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          entry.classList.remove('is-hidden');
        } else {
          entry.classList.add('is-hidden');
        }
      });
    });
  });

  /* ──────────────────────────────────────────────
     7. SMOOTH ACCORDION (FAQ)
  ────────────────────────────────────────────── */
  var accordionTriggers = document.querySelectorAll('.accordion-trigger');

  accordionTriggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var isExpanded = this.getAttribute('aria-expanded') === 'true';

      // Close all others for single-open elegance
      accordionTriggers.forEach(function (other) {
        other.setAttribute('aria-expanded', 'false');
      });

      // Toggle current
      if (!isExpanded) {
        this.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ──────────────────────────────────────────────
     8. GENTLE SWIPE / TOUCH TO DISMISS (MOBILE SHEET)
  ────────────────────────────────────────────── */
  var touchStartY = 0;
  var touchCurrentY = 0;

  if (drawer) {
    drawer.addEventListener('touchstart', function (e) {
      if (window.innerWidth <= 768) {
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    drawer.addEventListener('touchmove', function (e) {
      if (window.innerWidth <= 768 && touchStartY > 0) {
        touchCurrentY = e.touches[0].clientY;
        var diff = touchCurrentY - touchStartY;
        if (diff > 0 && drawer.scrollTop <= 0) {
          drawer.style.transform = 'translateY(' + diff + 'px)';
        }
      }
    }, { passive: true });

    drawer.addEventListener('touchend', function () {
      if (window.innerWidth <= 768 && touchStartY > 0) {
        var diff = touchCurrentY - touchStartY;
        if (diff > 120) {
          drawer.style.transform = '';
          closeDrawer();
        } else {
          drawer.style.transform = '';
        }
        touchStartY = 0;
        touchCurrentY = 0;
      }
    });
  }

  /* ──────────────────────────────────────────────
     9. EXECUTIVE CEREMONIAL INTRO SPLASH
  ────────────────────────────────────────────── */
  var introElement = document.getElementById('executiveIntro');
  var introSkipBtn = document.getElementById('introSkipBtn');

  if (introElement) {
    var hasSeenIntro = false;
    try {
      hasSeenIntro = sessionStorage.getItem('crmg_intro_viewed') === 'true';
    } catch (e) {
      hasSeenIntro = false;
    }

    // Allow testing via URL query e.g. ?intro=1 or ?intro=true
    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('intro') === '1' || urlParams.get('intro') === 'true') {
      hasSeenIntro = false;
    }

    if (hasSeenIntro) {
      introElement.classList.add('intro-hidden');
    } else {
      var introDismissed = false;
      var dismissIntro = function () {
        if (introDismissed) return;
        introDismissed = true;
        try {
          sessionStorage.setItem('crmg_intro_viewed', 'true');
        } catch (e) {}

        introElement.classList.add('intro-leaving');
        setTimeout(function () {
          introElement.classList.add('intro-hidden');
          introElement.classList.remove('intro-leaving');
        }, 750);
      };

      // Automatically advance after 2.3 seconds
      var autoTimer = setTimeout(dismissIntro, 2300);

      // Explicit dismiss button
      if (introSkipBtn) {
        introSkipBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          clearTimeout(autoTimer);
          dismissIntro();
        });
      }

      // Tap or click anywhere on intro screen to dismiss
      introElement.addEventListener('click', function () {
        clearTimeout(autoTimer);
        dismissIntro();
      });

      // Keyboard dismissal (Enter, Space, or Escape)
      document.addEventListener('keydown', function (e) {
        if (!introDismissed && (e.key === 'Enter' || e.key === 'Escape' || e.key === ' ')) {
          clearTimeout(autoTimer);
          dismissIntro();
        }
      });
    }
  }

})();
