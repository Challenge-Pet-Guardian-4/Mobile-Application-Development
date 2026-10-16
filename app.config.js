const { execSync } = require('child_process');

function getGitMetadata() {
  try {
    const commitHash = execSync('git rev-parse HEAD', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    const shortCommitHash = commitHash.slice(0, 7);
    const branch = execSync('git rev-parse --abbrev-ref HEAD', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    const commitDate = execSync('git log -1 --format=%cI', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    const rawCommitMessage = execSync('git log -1 --format=%s', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    const cleanMsg = rawCommitMessage.replace(/[\r\n]+/g, ' ').trim();
    const commitMessage = cleanMsg.length <= 60 ? cleanMsg : `${cleanMsg.slice(0, 60).trim()}...`;

    return { commitHash, shortCommitHash, branch, commitDate, commitMessage };
  } catch (_error) {
    return {
      commitHash: '',
      shortCommitHash: '',
      branch: '',
      commitDate: '',
      commitMessage: '',
    };
  }
}

module.exports = ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    gitCommit: getGitMetadata(),
  },
});
