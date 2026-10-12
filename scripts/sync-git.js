/**
 * scripts/sync-git.js
 * Extrai dinamicamente o commit hash atual do Git e sincroniza
 * src/config/gitCommit.ts para manter os metadados do aplicativo sempre atualizados.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const targetFile = path.resolve(__dirname, '../src/config/gitCommit.ts');

function formatCommitMessage(msg, maxLength = 60) {
  if (!msg) return '';
  const clean = msg.replace(/[\r\n]+/g, ' ').trim();
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength).trim()}...`;
}

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
    const commitMessage = formatCommitMessage(rawCommitMessage, 60);

    return { commitHash, shortCommitHash, branch, commitDate, commitMessage };
  } catch (_error) {
    return null;
  }
}

function sync() {
  const gitData = getGitMetadata();

  if (!gitData) {
    if (fs.existsSync(targetFile)) {
      console.log('[Git Sync] Git indisponível. Mantendo arquivo gitCommit.ts existente.');
      return;
    }
  }

  const data = gitData || {
    commitHash: '0540435d028cece22d5ea36c621c7d130a730c3a',
    shortCommitHash: '0540435',
    branch: 'main',
    commitDate: new Date().toISOString(),
    commitMessage: 'feat: Atualizando gitCommit na aplicação',
  };

  const safeCommitMessage = (data.commitMessage || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");

  const fileContent = `/**
 * PetGuardian - Metadados de Commit Gerados Automaticamente
 * Atualizado dinamicamente via Git antes de cada execução/build (scripts/sync-git.js).
 */

export const GIT_COMMIT_INFO = {
  commitHash: '${data.commitHash}',
  shortCommitHash: '${data.shortCommitHash}',
  branch: '${data.branch}',
  commitDate: '${data.commitDate}',
  commitMessage: '${safeCommitMessage}',
} as const;
`;

  if (fs.existsSync(targetFile)) {
    const currentContent = fs.readFileSync(targetFile, 'utf8');
    if (currentContent === fileContent) {
      console.log(`[Git Sync] Commit hash já sincronizado (${data.shortCommitHash}).`);
      return;
    }
  }

  fs.writeFileSync(targetFile, fileContent, 'utf8');
  console.log(`[Git Sync] Commit sincronizado com sucesso: ${data.shortCommitHash} (${data.branch})`);
}

sync();
