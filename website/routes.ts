import { IRoutes, GenerateRoutes } from '@guild-docs/server';

export function getRoutes(): IRoutes {
  const Routes: IRoutes = {
    _: {
      introduction: {
        $name: 'Introduction',
        $routes: ['index', 'installation'],
      },
      essentials: {
        $name: 'Essentials',
        $routes: [
          'diff',
          'notifications',
          'validate',
          'coverage',
          'similar',
          'serve',
          'introspect',
        ],
      },
      recipes: {
        $name: 'Recipes',
        $routes: [
          'environments',
          'endpoints',
          'intercept',
          'annotations',
          'pull-requests',
        ],
      },
      products: {
        $name: 'Products',
        $routes: ['ci', 'github', 'action'],
      },
      api: {
        $name: 'API',
        $routes: ['schema', 'documents'],
      },
    },
  };

  GenerateRoutes({
    Routes,
    folderPattern: 'docs',
  });

  return {
    _: Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      Object.entries(Routes._).map(([key, value]) => [`docs/${key}`, value]),
    ),
  };
}
