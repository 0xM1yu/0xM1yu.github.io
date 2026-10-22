(() => {
  const headings = document.querySelectorAll('.article h2[id]');
  const links = [...document.querySelectorAll('.toc-link')];
  if (!headings.length || !links.length) return;

  const linksById = new Map(links.map(link => [link.getAttribute('href').slice(1), link]));
  let activeLink = links.find(link => link.classList.contains('toc-link--active'));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const nextLink = linksById.get(entry.target.id);
      if (nextLink === activeLink) return;

      activeLink?.classList.remove('toc-link--active');
      nextLink?.classList.add('toc-link--active');
      activeLink = nextLink;
    });
  }, {
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0,
  });

  headings.forEach(heading => observer.observe(heading));
})();
