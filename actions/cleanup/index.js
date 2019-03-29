// @ts-check
const {Toolkit} = require('actions-toolkit');

Toolkit.run(
  async tools => {
    const payload = tools.context.payload;

    tools.log.info('Cleaning up after Pull Request was merged or closed');

    await tools.github.git.deleteRef(
      tools.context.repo({
        ref: `heads/${payload.pull_request.head.ref}`,
      }),
    );

    return tools.log.success(
      `Branch ${payload.pull_request.head.ref} deleted!`,
    );
  },
  {
    event: 'pull_request.closed',
    secrets: ['GITHUB_TOKEN'],
  },
);
