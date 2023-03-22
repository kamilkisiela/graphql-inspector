import * as core from '@actions/core';
import { run } from './run.js';

(global as any).navigator = {
  userAgent: 'node.js',
};

run().catch(e => {
  core.setFailed(e.message || e);
});
