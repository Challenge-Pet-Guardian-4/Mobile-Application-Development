import { GIT_COMMIT_INFO } from './gitCommit';

export const APP_VERSION_INFO = {
  appName: 'PetGuardian',
  tagline: 'Ecossistema Pet-Centric & Governança Familiar',
  version: '1.0.0',
  buildNumber: '4',
  sprint: '4ª Sprint (Entrega Final)',
  disciplina: 'Mobile Application Development',
  instituicao: 'FIAP - 2TDSPG',
  challenge: 'Challenge Clyvo 2026',
  // Metadados dinâmicos sincronizados com o Git HEAD
  commitHash: GIT_COMMIT_INFO.commitHash,
  shortCommitHash: GIT_COMMIT_INFO.shortCommitHash,
  commitDate: GIT_COMMIT_INFO.commitDate,
  branch: GIT_COMMIT_INFO.branch,
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
