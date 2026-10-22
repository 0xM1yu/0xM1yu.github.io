(() => {
  const searchInput = document.querySelector('#post-search');
  const emptyState = document.querySelector('#empty-state');
  const categoryButtons = [...document.querySelectorAll('.category-button')];
  const languageSwitch = document.querySelector('.language-switch');
  const languageButtons = [...languageSwitch.querySelectorAll('button')];
  const posts = [...document.querySelectorAll('.post-card')].map(element => ({
    element,
    category: element.dataset.category,
    searchText: element.textContent.toLocaleLowerCase(),
  }));

  let activeCategory = 'all';
  let hasEmptySearch = false;

  // Card contents are static: prepare search text and category totals once.
  const categoryCounts = new Map();
  posts.forEach(({ category }) => {
    categoryCounts.set(category, (categoryCounts.get(category) ?? 0) + 1);
  });
  categoryButtons.forEach(button => {
    const count = button.dataset.category === 'all'
      ? posts.length
      : categoryCounts.get(button.dataset.category) ?? 0;
    button.querySelector('.category-count').textContent = ` (${count})`;
  });

  function selectButton(buttons, selectedButton) {
    buttons.forEach(button => {
      button.setAttribute('aria-pressed', String(button === selectedButton));
    });
  }

  function updateEmptyState() {
    emptyState.hidden = !hasEmptySearch;
    emptyState.textContent = hasEmptySearch
      ? (document.documentElement.lang === 'ko' ? '일치하는 글이 없습니다.' : 'No matching posts.')
      : '';
  }

  function updatePosts() {
    const query = searchInput.value.trim().toLocaleLowerCase();
    let visibleCount = 0;

    posts.forEach(({ element, category, searchText }) => {
      const matches = (activeCategory === 'all' || category === activeCategory)
        && (!query || searchText.includes(query));
      const hidden = !matches;
      if (element.hidden !== hidden) element.hidden = hidden;
      if (matches) visibleCount += 1;
    });

    hasEmptySearch = visibleCount === 0 && query.length > 0;
    updateEmptyState();
  }

  categoryButtons.forEach(button => button.addEventListener('click', () => {
    activeCategory = button.dataset.category;
    selectButton(categoryButtons, button);
    updatePosts();
  }));

  languageButtons.forEach(button => button.addEventListener('click', () => {
    document.documentElement.lang = button.dataset.lang;
    languageSwitch.dataset.active = button.dataset.lang;
    selectButton(languageButtons, button);
    updateEmptyState();
  }));

  searchInput.addEventListener('input', updatePosts);
  updatePosts();
})();
