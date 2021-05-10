if (typeof window !== 'undefined') {
  if (localStorage.getItem('theme') === 'dark') {
    localStorage.removeItem('theme')
  }
}
