const BREAKING = {
  YES: false,
  NOT: true,
};

/**
 * @type import('@graphql-inspector/core').UsageHandler
 */
const checkUsage = changes => {
  return changes.map(change => {
    if (change.type === 'Hotel') {
      return BREAKING.NOT;
    }

    if (change.type === 'Query' && change.field === 'hotels') {
      return BREAKING.NOT;
    }

    return BREAKING.YES;
  });
};

module.exports = checkUsage;
