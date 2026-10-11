/**
 * PetGuardian - Metadados de Versão e Publicação (Sprint 4)
 * Atende aos requisitos avaliativos da Entrega Final:
 * 1. Identificação clara da versão e build publicado no Firebase App Distribution
 * 2. Hash do commit de referência da versão entregue para avaliação
 * 3. Integrantes da equipe de desenvolvimento e informações da disciplina
 */

export const APP_VERSION_INFO = {
  appName: 'PetGuardian',
  tagline: 'Ecossistema Pet-Centric & Governança Familiar',
  version: '1.0.0',
  buildNumber: '4',
  sprint: '4ª Sprint (Entrega Final)',
  disciplina: 'Mobile Application Development',
  instituicao: 'FIAP - 2TDSPG',
  challenge: 'Challenge Clyvo 2026',
  // Hash do commit de referência no repositório GitHub Classroom
  commitHash: 'fc8ca3c652cfb729c32ba6a042c1645ce393be4f',
  shortCommitHash: 'fc8ca3c',
  target: 'Firebase App Distribution / Android APK Release',
  repositorio: 'https://github.com/Challenge-Pet-Guardian-4/Mobile-Application-Development',
  equipe: [
    { nome: 'Enzo Okuizumi', rm: '561432' },
    { nome: 'Gustavo Okada', rm: '563428' },
    { nome: 'Lucas Barros Gouveia', rm: '566422' },
    { nome: 'Luna de Carvalho Guimarães', rm: '562290' },
    { nome: 'Milton Marcelino', rm: '564836' },
  ],
} as const;
