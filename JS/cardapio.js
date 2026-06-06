(() => {
  'use strict';

  const searchToggle = document.getElementById('searchToggle');
  const headerSearchWrap = document.getElementById('headerSearchWrap');
  const searchClose = document.getElementById('searchClose');
  const searchInput = document.getElementById('searchInput');
  const headerInner = document.querySelector('.header-inner');

  function openSearch() {
    if (!headerSearchWrap || !searchToggle) return;
    headerSearchWrap.classList.add('open');
    searchToggle.classList.add('active');
    if (headerInner) headerInner.classList.add('search-active');
    setTimeout(() => searchInput && searchInput.focus(), 220);
  }

  function closeSearch() {
    if (!headerSearchWrap || !searchToggle) return;
    headerSearchWrap.classList.remove('open');
    searchToggle.classList.remove('active');
    if (headerInner) headerInner.classList.remove('search-active');
    if (searchInput) {
      searchInput.value = '';
      searchInput.dispatchEvent(new Event('input'));
    }
  }

  if (searchToggle) searchToggle.addEventListener('click', openSearch);
  if (searchClose) searchClose.addEventListener('click', closeSearch);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && headerSearchWrap && headerSearchWrap.classList.contains('open')) closeSearch();
  });

  const fabMain = document.getElementById('fabMain');
  const fabSocials = document.getElementById('fabSocials');
  const fabTop = document.getElementById('fabTop');

  if (fabMain && fabSocials) {
    fabMain.addEventListener('click', () => {
      const isOpen = fabSocials.classList.toggle('open');
      fabMain.classList.toggle('open', isOpen);
      fabMain.textContent = isOpen ? '+' : '🍕';
    });

    fabSocials.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        fabSocials.classList.remove('open');
        fabMain.classList.remove('open');
        fabMain.textContent = '🍕';
      });
    });
  }

  if (fabTop) {
    window.addEventListener('scroll', () => {
      fabTop.classList.toggle('visible', window.scrollY > 300);
    }, { passive: true });
    fabTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  const allCards = document.querySelectorAll('.item-card');
  const allBlocks = document.querySelectorAll('.menu-block');
  const emptyState = document.getElementById('emptyState');
  const pizzaSubcats = document.getElementById('pizzaSubcats');
  const tabButtons = document.querySelectorAll('.tab-btn');
  const subcatPills = document.querySelectorAll('.subcat-pill');
  const drinkCards = document.querySelectorAll('.drink-card');

  function setEmptyState(isVisible) {
    if (emptyState) emptyState.classList.toggle('visible', isVisible);
  }

  function applyFilter(tab, pizzaSub) {
    let anyVisible = false;

    allCards.forEach((card) => {
      const cat = card.dataset.cat;
      const sub = card.dataset.sub || '';
      const isDoce = card.dataset.doce === 'true';
      let show = false;

      if (tab === 'all') show = true;
      else if (tab === 'doces') show = isDoce;
      else if (tab === 'pizzas') show = cat === 'pizzas' && (pizzaSub === 'all-pizza' || sub === pizzaSub);
      else show = cat === tab;

      card.classList.toggle('hidden', !show);
      if (show) anyVisible = true;
    });

    drinkCards.forEach((card) => {
      const show = tab === 'all' || tab === 'drinks';
      card.classList.toggle('hidden', !show);
      if (show) anyVisible = true;
    });

    allBlocks.forEach((block) => {
      const sec = block.dataset.section;
      let showBlock = tab === 'all';
      if (tab === 'doces') showBlock = sec !== 'porcoes' && sec !== 'bebidas';
      else if (tab === sec) showBlock = true;
      else if (tab === 'pizzas' && sec === 'pizzas') showBlock = true;
      else if (tab === 'bebidas' && sec === 'bebidas') showBlock = true;
      else if (tab === 'porcoes' && sec === 'porcoes') showBlock = true;
      else if (tab === 'drinks' && sec === 'drinks') showBlock = true;
      block.style.display = showBlock ? '' : 'none';
    });

    setEmptyState(!anyVisible);
  }

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabButtons.forEach((button) => button.classList.remove('active'));
      btn.classList.add('active');
      if (searchInput) searchInput.value = '';

      const tab = btn.dataset.tab;
      if (pizzaSubcats) pizzaSubcats.classList.toggle('visible', tab === 'pizzas');

      subcatPills.forEach((pill) => pill.classList.remove('active'));
      const allPill = document.querySelector('[data-subcat="all-pizza"]');
      if (allPill) allPill.classList.add('active');

      applyFilter(tab, 'all-pizza');
    });
  });

  subcatPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      subcatPills.forEach((item) => item.classList.remove('active'));
      pill.classList.add('active');
      applyFilter('pizzas', pill.dataset.subcat);
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase().trim();

      if (!q) {
        const activeTab = document.querySelector('.tab-btn.active')?.dataset.tab || 'all';
        const activeSub = document.querySelector('.subcat-pill.active')?.dataset.subcat || 'all-pizza';
        applyFilter(activeTab, activeSub);
        return;
      }

      tabButtons.forEach((button) => button.classList.remove('active'));
      const allTab = document.querySelector('[data-tab="all"]');
      if (allTab) allTab.classList.add('active');
      allBlocks.forEach((block) => { block.style.display = ''; });
      if (pizzaSubcats) pizzaSubcats.classList.remove('visible');

      let anyVisible = false;
      allCards.forEach((card) => {
        const name = card.querySelector('.item-name')?.textContent.toLowerCase() || '';
        const desc = card.querySelector('.item-desc')?.textContent.toLowerCase() || '';
        const match = name.includes(q) || desc.includes(q);
        card.classList.toggle('hidden', !match);
        if (match) anyVisible = true;
      });

      drinkCards.forEach((card) => {
        const name = card.querySelector('.drink-name')?.textContent.toLowerCase() || '';
        const desc = card.querySelector('.drink-desc')?.textContent.toLowerCase() || '';
        const match = name.includes(q) || desc.includes(q);
        card.classList.toggle('hidden', !match);
        if (match) anyVisible = true;
      });

      setEmptyState(!anyVisible);
    });
  }
})();
