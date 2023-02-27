module.exports = ({ changes }) => {
  return changes.map(c => ({
    ...c,
    criticality: { ...c.criticality, level: 'DANGEROUS' },
  }));
};
