import { execSync } from 'child_process';
import * as github from '@actions/github';
import { OctokitInstance } from './types.js';

export function getCurrentCommitSha() {
  const sha = execSync(`git rev-parse HEAD`).toString().trim();

  try {
    const msg = execSync(`git show ${sha} -s --format=%s`).toString().trim();
    const PR_MSG = /Merge (\w+) into \w+/i;

    if (PR_MSG.test(msg)) {
      const result = PR_MSG.exec(msg);

      if (result) {
        return result[1];
      }
    }
  } catch (e) {
    //
  }

  return sha;
}

export async function getAssociatedPullRequest(octokit: OctokitInstance, commitSha: string) {
  const result = await octokit.request('GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls', {
    ...github.context.repo,
    commit_sha: commitSha,
    mediaType: {
      format: 'json',
      previews: ['groot'],
    },
  });
  return result.data.length > 0 ? result.data[0] : null;
}
