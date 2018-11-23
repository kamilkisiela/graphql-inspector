module.exports = {
  'packages/*/{src,__tests__}/**/*.ts': ['prettier --write', 'git add'],
};
