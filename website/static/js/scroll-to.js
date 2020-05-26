window.addEventListener('load', function () {
  function scrollTo(id) {
    return (e) => {
      e.preventDefault();

      const el = document.getElementById(id);

      if (el) {
        window.scrollTo({
          behavior: 'smooth',
          top: el.offsetTop,
        });
      }
    };
  }

  document.querySelectorAll('a.scroll-to').forEach((el) => {
    el.addEventListener(
      'click',
      scrollTo(el.getAttribute('href').replace('#', '')),
    );
  });
});
