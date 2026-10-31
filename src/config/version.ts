import Constants from 'expo-constants';

export interface GitCommitMetadata {
  commitHash: string;
  shortCommitHash: string;
  commitDate: string;
  branch: string;
  commitMessage: string;
}

const dynamicGitInfo = Constants.expoConfig?.extra?.gitCommit as Partial<GitCommitMetadata> | undefined;

export const GIT_COMMIT_INFO: GitCommitMetadata = {
  commitHash: dynamicGitInfo?.commitHash ?? '',
  shortCommitHash: dynamicGitInfo?.shortCommitHash ?? '',
  commitDate: dynamicGitInfo?.commitDate ?? '',
  branch: dynamicGitInfo?.branch ?? '',
  commitMessage: dynamicGitInfo?.commitMessage ?? '',
};

export const APP_VERSION_INFO = {
  appName: 'PetGuardian',
  tagline: 'Ecossistema Pet-Centric & Governança Familiar',
  version: '1.0.0',
  buildNumber: '8',
  sprint: '4ª Sprint (Entrega Final)',
  disciplina: 'Mobile Application Development',
  instituicao: 'FIAP - 2TDSPG',
  challenge: 'Challenge Clyvo 2026',
  // Metadados dinâmicos sincronizados com o Git HEAD
  commitHash: GIT_COMMIT_INFO.commitHash,
  shortCommitHash: GIT_COMMIT_INFO.shortCommitHash,
  commitDate: GIT_COMMIT_INFO.commitDate,
  branch: GIT_COMMIT_INFO.branch,
  commitMessage: GIT_COMMIT_INFO.commitMessage,
  target: 'GitHub Release / APK Android',
  repositorio: 'https://github.com/Challenge-Pet-Guardian-4/Mobile-Application-Development',
  equipe: [
    { nome: 'Enzo Okuizumi', rm: '561432' },
    { nome: 'Gustavo Okada', rm: '563428' },
    { nome: 'Lucas Barros Gouveia', rm: '566422' },
    { nome: 'Luna de Carvalho Guimarães', rm: '562290' },
    { nome: 'Milton Marcelino', rm: '564836' },
  ],
} as const;
