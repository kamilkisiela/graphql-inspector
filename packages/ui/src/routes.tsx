import Empty from './Empty';
import {MenuItem} from './ui/Menu';
import Dashboard from './ui/features/dashboard/Dashboard'

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
    component: Empty,
  },
  {
    key: 'similar',
    to: '/similar',
    name: 'Find Duplicates',
    iconName: 'MergeDuplicate',
    component: Empty,
  },
  {
    key: 'coverage',
    to: '/coverage',
    name: 'Schema Coverage',
    iconName: 'CompassNW',
    component: Empty,
  },
  {
    key: 'validate',
    to: '/validate',
    name: 'Validate documents',
    iconName: 'Error',
    component: Empty,
  },
];

export default routes;
