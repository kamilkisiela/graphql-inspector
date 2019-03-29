const {Toolkit} = require('actions-toolkit');

Toolkit.run(
  async tools => {
    tools.log.info(tools.context.payload.pull_request);
    if (
      tools.context.payload.pull_request.merged ||
      tools.context.payload.pull_request.closed
    ) {
      tools.log.info('Cleaning up after Pull Request was merged or closed');
      tools.github.git
        .deleteRef(
          tools.context.repo({
            ref: `heads/${payload.pull_request.head.ref}`,
          }),
        )
        .then(() => {
          tools.log.success(`Branch ${payload.pull_request.head.ref} deleted!`);
        });
    }
  },
  {
    event: 'pull_request.closed',
    secrets: 'GITHUB_TOKEN',
  },
);
