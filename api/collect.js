/// @ts-check
const {GraphQLClient} = require('graphql-request');

const OPERATIONS = {
  get: /* GraphQL */ `
    query monthlyStatByDateAndKind($date: String!, $kind: String!) {
      stat: monthlyStatByDateAndKind(date: $date, kind: $kind) {
        _id
        count
        kind
      }
    }
  `,
  update: /* GraphQL */ `
    mutation updateMonthlyStat($id: ID!, $data: MonthlyStatInput!) {
      updateMonthlyStat(id: $id, data: $data) {
        _id
      }
    }
  `,
  create: /* GraphQL */ `
    mutation createMonthlyStat($data: MonthlyStatInput!) {
      createMonthlyStat(data: $data) {
        _id
      }
    }
  `,
};

/**
 * @param {import('@now/node').NowRequest} req
 * @param {import('@now/node').NowResponse} res
 */
async function handlerBing(req, res) {
  const secret = process.env.FAUNADB_STATS_SECRET;

  try {
    if (!secret) {
      throw new Error(`FAUNADB_STATS_SECRET is missing`);
    }

    let kind = req.query.kind;

    if (typeof kind !== 'string') {
      throw new Error(`"kind" param is missing`);
    }

    kind = kind.toLowerCase();

    console.log(`Usage: ${kind}`);

    const graphQLClient = new GraphQLClient(
      'https://graphql.fauna.com/graphql',
      {
        headers: {
          Authorization: `Basic ${secret}`,
        },
      },
    );

    const now = new Date();
    const date = [now.getFullYear(), now.getMonth() + 1].join('-');

    const existing = await graphQLClient.request(OPERATIONS.get, {
      kind,
      date,
    });

    if (existing && existing.stat) {
      await graphQLClient.request(OPERATIONS.update, {
        id: existing.stat._id,
        data: {
          date,
          count: existing.stat.count + 1,
          kind,
        },
      });
      
    } else {
      await graphQLClient.request(OPERATIONS.create, {
        data: {
          date,
          count: 1,
          kind,
        },
      });
    }

    console.log('Updated stats');
  } catch (e) {
    console.log('Failed to update stats');
    console.error(e);
  }

  res.status(200);
  res.statusMessage = 'ok';
  res.end();
}

module.exports = handlerBing;
