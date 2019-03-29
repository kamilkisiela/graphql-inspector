// @ts-check
const {Toolkit} = require('actions-toolkit');

const label = 'waiting-for-release';

Toolkit.run(
  async tools => {
    const payload = tools.context.payload;

    tools.log.info('Pull Request was merged so take care of related issues');

    if (payload.pull_request.merged && payload.pull_request.body) {
      const R_Label = /Label #(\d+)/gi;

      const issues = [];
      let match;
      while ((match = R_Label.exec(payload.pull_request.body)) !== null) {
        issues.push(parseInt(match[1], 10));
      }

      const {owner, repo} = tools.context.repo();

      if (issues) {
        await Promise.all(
          issues.map(no => {
            return tools.github.issues.addLabels({
              owner,
              repo,
              number: no,
              labels: [label],
            });
          }),
        );

        return tools.exit.success(`Related issues marked as ${label}.`);
      } else {
        tools.log.info('No related issues');
      }
    }

    return tools.exit.neutral(`No action`);
  },
  {
    event: 'pull_request.closed',
    secrets: ['GITHUB_TOKEN'],
  },
);
