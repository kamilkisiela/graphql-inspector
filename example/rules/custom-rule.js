module.exports = ({ changes }) => {
  changes.forEach(c => console.log(c));

  return changes;
};
