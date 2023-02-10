import { getOctokit } from '@actions/github';

export type OctokitInstance = ReturnType<typeof getOctokit>;
