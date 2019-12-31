#!/usr/bin/env node

import core from '@actions/core';
import {run} from './run';

run().catch(e => {
  core.setFailed(e.message || e);
});
