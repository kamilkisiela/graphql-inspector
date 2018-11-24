import Empty from './Empty';
import {MenuItem} from './ui/Menu';
import Dashboard from './ui/features/dashboard/Dashboard';
import Diff from './ui/features/diff/Diff';
import Validate from './ui/features/validate/Validate';
import Coverage from './ui/features/coverage/Coverage';
import Similar from './ui/features/similar/Similar';

const routes: MenuItem[] = [
  {
    key: 'index',
    to: '/',
    name: 'Dashboard',
    iconName: 'ViewDashboard',
    component: Dashboard,
  },
  {
    key: 'diff',
    to: '/diff',
    name: 'Diff Schemas',
    iconName: 'DiffSideBySide',
    component: Diff,
  },
  {
    key: 'similar',
    to: '/similar',
    name: 'Find Duplicates',
    iconName: 'MergeDuplicate',
    component: Similar,
  },
  {
    key: 'coverage',
    to: '/coverage',
    name: 'Schema Coverage',
    iconName: 'CompassNW',
    component: Coverage,
  },
  {
    key: 'validate',
    to: '/validate',
    name: 'Validate documents',
    iconName: 'Error',
    component: Validate,
  },
];

export default routes;
