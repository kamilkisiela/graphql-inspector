import { createConfig } from '../src/helpers/config';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const dummySetConfig = () => {};
describe('multiple environments', () => {
  describe('when branch matches environment', () => {
    const branches = ['master'];

    test('diff should be enabled by default', () => {
      const config = createConfig(
        {
          env: {
            production: {
              branch: 'master',
            },
          },
          schema: 'schema.graphql',
        },
        dummySetConfig,
        branches,
      );
      expect(config.diff).toEqual({
        annotations: true,
        failOnBreaking: true,
      });
    });

    test('diff should be disabled on demand', () => {
      const config = createConfig(
        {
          env: {
            production: {
              branch: 'master',
              diff: false,
            },
          },
          schema: 'schema.graphql',
        },
        dummySetConfig,
        branches,
      );
      expect(config.diff).toBe(false);
    });

    test('setting diff as true should enable annotations and failOnBreaking', () => {
      const config = createConfig(
        {
          env: {
            production: {
              branch: 'master',
              diff: true,
            },
          },
          schema: 'schema.graphql',
        },
        dummySetConfig,
        branches,
      );
      expect(config.diff).toEqual({
        annotations: true,
        failOnBreaking: true,
      });
    });

    test('branch should match', () => {
      const config = createConfig(
        {
          env: {
            production: {
              branch: 'master',
            },
          },
          schema: 'schema.graphql',
        },
        dummySetConfig,
        branches,
      );
      expect(config.branch).toBe('master');
    });

    test('schema should match', () => {
      const config = createConfig(
        {
          env: {
            production: {
              branch: 'master',
            },
          },
          schema: 'schema.graphql',
        },
        dummySetConfig,
        branches,
      );
      expect(config.schema).toBe('schema.graphql');
    });

    test('endpoint should match', () => {
      const config = createConfig(
        {
          env: {
            production: {
              branch: 'master',
              endpoint: 'api',
            },
          },
          schema: 'schema.graphql',
        },
        dummySetConfig,
        branches,
      );
      expect(config.endpoint).toBe('api');
    });

    test('notifications should be disabled by default', () => {
      const config = createConfig(
        {
          env: {
            production: {
              branch: 'master',
            },
          },
          schema: 'schema.graphql',
        },
        dummySetConfig,
        branches,
      );
      expect(config.notifications).toBe(false);
    });

    test('env diff should overwrite global diff', () => {
      const config = createConfig(
        {
          diff: false,
          env: {
            production: {
              branch: 'master',
              diff: {
                annotations: true,
                failOnBreaking: false,
              },
            },
          },
          schema: 'schema.graphql',
        },
        dummySetConfig,
        branches,
      );
      expect(config.diff).toEqual({
        annotations: true,
        failOnBreaking: false,
      });
    });

    test('env diff.annotations should overwrite global diff.annotations', () => {
      const config = createConfig(
        {
          diff: {
            annotations: true,
          },
          env: {
            production: {
              branch: 'master',
              diff: {
                annotations: false,
                failOnBreaking: true,
              },
            },
          },
          schema: 'schema.graphql',
        },
        dummySetConfig,
        branches,
      );
      expect(config.diff).toEqual({
        annotations: false,
        failOnBreaking: true,
      });
    });

    test('env notifications should overwrite global notifications', () => {
      const config = createConfig(
        {
          notifications: false,
          env: {
            production: {
              branch: 'master',
              notifications: {
                slack: 'slack',
              },
            },
          },
          schema: 'schema.graphql',
        },
        dummySetConfig,
        branches,
      );
      expect(config.notifications).toEqual({
        slack: 'slack',
      });
    });

    test('env notifications.slack should overwrite global notifications.slack', () => {
      const config = createConfig(
        {
          notifications: {
            slack: 'global',
          },
          env: {
            production: {
              branch: 'master',
              notifications: {
                slack: 'local',
              },
            },
          },
          schema: 'schema.graphql',
        },
        dummySetConfig,
        branches,
      );
      expect(config.notifications).toEqual({
        slack: 'local',
      });
    });

    test('global notifications should apply in all environments', () => {
      const config = createConfig(
        {
          notifications: {
            slack: 'global',
          },
          env: {
            production: {
              branch: 'master',
            },
          },
          schema: 'schema.graphql',
        },
        dummySetConfig,
        branches,
      );
      expect(config.notifications).toEqual({
        slack: 'global',
      });
    });
  });

  describe('when branch DOES NOT match any environment (random PR)', () => {
    test('diff should be enabled by default', () => {
      const config = createConfig(
        {
          env: {
            production: {
              branch: 'master',
            },
          },
          schema: 'schema.graphql',
        },
        dummySetConfig,
      );
      expect(config.diff).toEqual({
        annotations: true,
        failOnBreaking: true,
      });
    });

    test('diff should be disabled on demand', () => {
      const config = createConfig(
        {
          diff: false,
          env: {
            production: {
              branch: 'master',
            },
          },
          schema: 'schema.graphql',
        },
        dummySetConfig,
      );
      expect(config.diff).toBe(false);
    });

    test('should put others over globals', () => {
      const config = createConfig(
        {
          diff: {
            annotations: true,
          },
          env: {
            production: {
              branch: 'master',
            },
          },
          schema: 'schema.graphql',
          others: {
            diff: {
              annotations: false,
            },
          },
        },
        dummySetConfig,
      );
      expect(config.diff).toEqual({
        annotations: false,
        failOnBreaking: true,
      });
    });

    test('setting diff as true should enable annotations and failOnBreaking', () => {
      const config = createConfig(
        {
          diff: true,
          env: {
            production: {
              branch: 'master',
            },
          },
          schema: 'schema.graphql',
        },
        dummySetConfig,
      );
      expect(config.diff).toEqual({
        annotations: true,
        failOnBreaking: true,
      });
    });

    test('branch should be * (any)', () => {
      const config = createConfig(
        {
          env: {
            production: {
              branch: 'master',
            },
          },
          schema: 'schema.graphql',
        },
        dummySetConfig,
      );
      expect(config.branch).toBe('*');
    });

    test('endpoint should be not defined', () => {
      const config = createConfig(
        {
          env: {
            production: {
              branch: 'master',
              endpoint: 'api',
            },
          },
          schema: 'schema.graphql',
        },
        dummySetConfig,
      );
      expect(config.endpoint).not.toBeDefined();
    });

    test('schema should match', () => {
      const config = createConfig(
        {
          env: {
            production: {
              branch: 'master',
            },
          },
          schema: 'schema.graphql',
        },
        dummySetConfig,
      );
      expect(config.schema).toBe('schema.graphql');
    });

    test('notifications should be disabled by default', () => {
      const config = createConfig(
        {
          env: {
            production: {
              branch: 'master',
            },
          },
          schema: 'schema.graphql',
        },
        dummySetConfig,
      );
      expect(config.notifications).toBe(false);
    });

    test('should use global diff even if some environemnt has local settings', () => {
      const config = createConfig(
        {
          diff: false,
          env: {
            production: {
              branch: 'master',
              diff: {
                annotations: true,
                failOnBreaking: false,
              },
            },
          },
          schema: 'schema.graphql',
        },
        dummySetConfig,
      );
      expect(config.diff).toBe(false);
    });

    test('should use global diff.annotations', () => {
      const config = createConfig(
        {
          diff: {
            annotations: true,
          },
          env: {
            production: {
              branch: 'master',
              diff: {
                annotations: false,
                failOnBreaking: true,
              },
            },
          },
          schema: 'schema.graphql',
        },
        dummySetConfig,
      );
      expect(config.diff).toEqual({
        annotations: true,
        failOnBreaking: true,
      });
    });

    test('notifications should be disabled when disabled globally', () => {
      const config = createConfig(
        {
          notifications: false,
          env: {
            production: {
              branch: 'master',
              notifications: {
                slack: 'slack',
              },
            },
          },
          schema: 'schema.graphql',
        },
        dummySetConfig,
      );
      expect(config.notifications).toBe(false);
    });

    test('notifications should be disabled', () => {
      const config = createConfig(
        {
          notifications: {
            slack: 'global',
          },
          env: {
            production: {
              branch: 'master',
            },
          },
          schema: 'schema.graphql',
        },
        dummySetConfig,
      );
      expect(config.notifications).toBe(false);
    });
  });
});

describe('single environment', () => {
  describe('when branches match', () => {
    const branches = ['master'];

    test('diff should be enabled by default', () => {
      const config = createConfig(
        {
          branch: 'master',
          schema: 'schema.graphql',
        },
        dummySetConfig,
        branches,
      );
      expect(config.diff).toEqual({
        annotations: true,
        failOnBreaking: true,
      });
    });

    test('diff should be disabled on demand', () => {
      const config = createConfig(
        {
          branch: 'master',
          schema: 'schema.graphql',
          diff: false,
        },
        dummySetConfig,
        branches,
      );
      expect(config.diff).toBe(false);
    });

    test('setting diff as true should enable annotations and failOnBreaking', () => {
      const config = createConfig(
        {
          branch: 'master',
          schema: 'schema.graphql',
          diff: true,
        },
        dummySetConfig,
        branches,
      );
      expect(config.diff).toEqual({
        annotations: true,
        failOnBreaking: true,
      });
    });

    test('branch should match', () => {
      const config = createConfig(
        {
          branch: 'master',
          schema: 'schema.graphql',
        },
        dummySetConfig,
        branches,
      );
      expect(config.branch).toBe('master');
    });

    test('endpoint should match', () => {
      const config = createConfig(
        {
          branch: 'master',
          endpoint: 'api',
          schema: 'schema.graphql',
        },
        dummySetConfig,
        branches,
      );
      expect(config.endpoint).toBe('api');
    });

    test('schema should match', () => {
      const config = createConfig(
        {
          branch: 'master',
          schema: 'schema.graphql',
        },
        dummySetConfig,
        branches,
      );
      expect(config.schema).toBe('schema.graphql');
    });

    test('notifications should be disabled by default', () => {
      const config = createConfig(
        {
          branch: 'master',
          schema: 'schema.graphql',
        },
        dummySetConfig,
        branches,
      );
      expect(config.notifications).toBe(false);
    });
  });

  describe('when branch DOES NOT match env branch', () => {
    test('diff should be enabled by default', () => {
      const config = createConfig(
        {
          branch: 'master',
          schema: 'schema.graphql',
        },
        dummySetConfig,
      );
      expect(config.diff).toEqual({
        annotations: true,
        failOnBreaking: true,
      });
    });

    test('diff should be disabled on demand', () => {
      const config = createConfig(
        {
          branch: 'master',
          schema: 'schema.graphql',
          diff: false,
        },
        dummySetConfig,
      );
      expect(config.diff).toBe(false);
    });

    test('diff should use others first', () => {
      const config = createConfig(
        {
          branch: 'master',
          schema: 'schema.graphql',
          diff: {
            failOnBreaking: true,
          },
          others: {
            diff: {
              annotations: false,
            },
          },
        },
        dummySetConfig,
      );
      expect(config.diff).toEqual({
        failOnBreaking: true,
        annotations: false,
      });
    });

    test('setting diff as true should enable annotations and failOnBreaking', () => {
      const config = createConfig(
        {
          branch: 'master',
          schema: 'schema.graphql',
          diff: true,
        },
        dummySetConfig,
      );
      expect(config.diff).toEqual({
        annotations: true,
        failOnBreaking: true,
      });
    });

    test('branch should not match', () => {
      const config = createConfig(
        {
          branch: 'master',
          schema: 'schema.graphql',
        },
        dummySetConfig,
      );
      expect(config.branch).toBe('*');
    });

    test('endpoint should not be defined', () => {
      const config = createConfig(
        {
          branch: 'master',
          endpoint: 'api',
          schema: 'schema.graphql',
        },
        dummySetConfig,
      );
      expect(config.endpoint).not.toBeDefined();
    });

    test('schema should match', () => {
      const config = createConfig(
        {
          branch: 'master',
          schema: 'schema.graphql',
        },
        dummySetConfig,
      );
      expect(config.schema).toBe('schema.graphql');
    });

    test('notifications should be disabled by default', () => {
      const config = createConfig(
        {
          branch: 'master',
          schema: 'schema.graphql',
        },
        dummySetConfig,
      );
      expect(config.notifications).toBe(false);
    });
  });
});

describe('legacy config', () => {
  describe('when branch mathes ref', () => {
    const branches = ['master'];

    test('diff should be enabled by default', () => {
      const config = createConfig(
        {
          schema: {
            ref: 'master',
            path: 'schema.graphql',
          },
        },
        dummySetConfig,
        branches,
      );
      expect(config.diff).toEqual({
        annotations: true,
        failOnBreaking: true,
      });
    });

    test('diff should be disabled on demand', () => {
      const config = createConfig(
        {
          schema: {
            ref: 'master',
            path: 'schema.graphql',
          },
          diff: false,
        },
        dummySetConfig,
        branches,
      );
      expect(config.diff).toBe(false);
    });

    test('setting diff as true should enable annotations and failOnBreaking', () => {
      const config = createConfig(
        {
          schema: {
            ref: 'master',
            path: 'schema.graphql',
          },
          diff: true,
        },
        dummySetConfig,
        branches,
      );
      expect(config.diff).toEqual({
        annotations: true,
        failOnBreaking: true,
      });
    });

    test('setting diff.annotations as true should enable annotations and failOnBreaking', () => {
      const config = createConfig(
        {
          schema: {
            ref: 'master',
            path: 'schema.graphql',
          },
          diff: {
            annotations: true,
          },
        },
        dummySetConfig,
        branches,
      );
      expect(config.diff).toEqual({
        annotations: true,
        failOnBreaking: true,
      });
    });

    test('setting diff.failOnBreaking as true should enable failOnBreaking and annotations', () => {
      const config = createConfig(
        {
          schema: {
            ref: 'master',
            path: 'schema.graphql',
          },
          diff: {
            failOnBreaking: true,
          },
        },
        dummySetConfig,
        branches,
      );
      expect(config.diff).toEqual({
        annotations: true,
        failOnBreaking: true,
      });
    });

    test('setting diff.failOnBreaking as true and annotations as false should enable and disable each', () => {
      const config = createConfig(
        {
          schema: {
            ref: 'master',
            path: 'schema.graphql',
          },
          diff: {
            failOnBreaking: true,
            annotations: false,
          },
        },
        dummySetConfig,
        branches,
      );
      expect(config.diff).toEqual({
        failOnBreaking: true,
        annotations: false,
      });
    });

    test('setting diff.failOnBreaking as false and annotations as true should disable and enable each', () => {
      const config = createConfig(
        {
          schema: {
            ref: 'master',
            path: 'schema.graphql',
          },
          diff: {
            failOnBreaking: false,
            annotations: true,
          },
        },
        dummySetConfig,
        branches,
      );
      expect(config.diff).toEqual({
        failOnBreaking: false,
        annotations: true,
      });
    });

    test('setting notifications as true should disable them', () => {
      const config = createConfig(
        {
          schema: {
            ref: 'master',
            path: 'schema.graphql',
          },
          notifications: true,
        } as any,
        dummySetConfig,
        branches,
      );
      expect(config.notifications).toBe(false);
    });

    test('setting notifications.slack should set notification.slack', () => {
      const config = createConfig(
        {
          schema: {
            ref: 'master',
            path: 'schema.graphql',
          },
          notifications: {
            slack: 'slack',
          },
        } as any,
        dummySetConfig,
        branches,
      );
      expect(config.notifications).toEqual({
        slack: 'slack',
      });
    });

    test('branch should equal ref', () => {
      const config = createConfig(
        {
          schema: {
            ref: 'master',
            path: 'schema.graphql',
          },
        },
        dummySetConfig,
        branches,
      );
      expect(config.branch).toBe('master');
    });

    test('schema should equal path', () => {
      const config = createConfig(
        {
          schema: {
            ref: 'master',
            path: 'schema.graphql',
          },
        },
        dummySetConfig,
        branches,
      );
      expect(config.schema).toBe('schema.graphql');
    });

    test('endpoint should match', () => {
      const config = createConfig(
        {
          schema: {
            ref: 'master',
            path: 'schema.graphql',
          },
          endpoint: 'api',
        },
        dummySetConfig,
        branches,
      );
      expect(config.endpoint).toBe('api');
    });

    test('notifications should be disabled by default', () => {
      const config = createConfig(
        {
          schema: {
            ref: 'master',
            path: 'schema.graphql',
          },
        },
        dummySetConfig,
        branches,
      );
      expect(config.notifications).toBe(false);
    });
  });

  describe('when branch DOES NOT match ref', () => {
    test('diff should be enabled by default', () => {
      const config = createConfig(
        {
          schema: {
            ref: 'master',
            path: 'schema.graphql',
          },
        },
        dummySetConfig,
      );
      expect(config.diff).toEqual({
        annotations: true,
        failOnBreaking: true,
      });
    });

    test('diff should be disabled on demand', () => {
      const config = createConfig(
        {
          schema: {
            ref: 'master',
            path: 'schema.graphql',
          },
          diff: false,
        },
        dummySetConfig,
      );
      expect(config.diff).toBe(false);
    });

    test('setting diff as true should enable annotations and failOnBreaking', () => {
      const config = createConfig(
        {
          schema: {
            ref: 'master',
            path: 'schema.graphql',
          },
          diff: true,
        },
        dummySetConfig,
      );
      expect(config.diff).toEqual({
        annotations: true,
        failOnBreaking: true,
      });
    });

    test('setting diff.annotations as true should enable annotations and failOnBreaking', () => {
      const config = createConfig(
        {
          schema: {
            ref: 'master',
            path: 'schema.graphql',
          },
          diff: {
            annotations: true,
          },
        },
        dummySetConfig,
      );
      expect(config.diff).toEqual({
        annotations: true,
        failOnBreaking: true,
      });
    });

    test('setting diff.failOnBreaking as true should enable failOnBreaking and annotations', () => {
      const config = createConfig(
        {
          schema: {
            ref: 'master',
            path: 'schema.graphql',
          },
          diff: {
            failOnBreaking: true,
          },
        },
        dummySetConfig,
      );
      expect(config.diff).toEqual({
        annotations: true,
        failOnBreaking: true,
      });
    });

    test('setting diff.failOnBreaking as true and annotations as false should enable and disable each', () => {
      const config = createConfig(
        {
          schema: {
            ref: 'master',
            path: 'schema.graphql',
          },
          diff: {
            failOnBreaking: true,
            annotations: false,
          },
        },
        dummySetConfig,
      );
      expect(config.diff).toEqual({
        failOnBreaking: true,
        annotations: false,
      });
    });

    test('setting diff.failOnBreaking as false and annotations as true should disable and enable each', () => {
      const config = createConfig(
        {
          schema: {
            ref: 'master',
            path: 'schema.graphql',
          },
          diff: {
            failOnBreaking: false,
            annotations: true,
          },
        },
        dummySetConfig,
      );
      expect(config.diff).toEqual({
        failOnBreaking: false,
        annotations: true,
      });
    });

    test('setting notifications as true should disable them', () => {
      const config = createConfig(
        {
          schema: {
            ref: 'master',
            path: 'schema.graphql',
          },
          notifications: true,
        } as any,
        dummySetConfig,
      );
      expect(config.notifications).toBe(false);
    });

    test('setting notifications.slack should set notification.slack', () => {
      const config = createConfig(
        {
          schema: {
            ref: 'master',
            path: 'schema.graphql',
          },
          notifications: {
            slack: 'slack',
          },
        } as any,
        dummySetConfig,
      );
      expect(config.notifications).toEqual({
        slack: 'slack',
      });
    });

    test('branch should equal ref', () => {
      const config = createConfig(
        {
          schema: {
            ref: 'master',
            path: 'schema.graphql',
          },
        },
        dummySetConfig,
      );
      expect(config.branch).toBe('master');
    });

    test('schema should equal path', () => {
      const config = createConfig(
        {
          schema: {
            ref: 'master',
            path: 'schema.graphql',
          },
        },
        dummySetConfig,
      );
      expect(config.schema).toBe('schema.graphql');
    });

    test('endpoint should match', () => {
      const config = createConfig(
        {
          schema: {
            ref: 'master',
            path: 'schema.graphql',
          },
          endpoint: 'api',
        },
        dummySetConfig,
      );
      expect(config.endpoint).not.toBeDefined();
    });

    test('notifications should be disabled by default', () => {
      const config = createConfig(
        {
          schema: {
            ref: 'master',
            path: 'schema.graphql',
          },
        },
        dummySetConfig,
      );
      expect(config.notifications).toBe(false);
    });
  });
});
