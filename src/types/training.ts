export type DificuldadeTreino = 'FACIL' | 'MEDIO' | 'AVANCADO';

export interface TrainingLesson {
  id: string;
  titulo: string;
  descricao: string;
  pontos: number;
  icone: string;
  duracaoMin: number;
  concluido: boolean;
  passos: string[];
}

export interface TrainingTrack {
  id: string;
  petId?: number;
  categoria: string;
  titulo: string;
  descricao: string;
  icone: string;
  cor: string;
  licoes: TrainingLesson[];
}

export interface AulaCompletaResponse {
  id: number;
  nome: string;
  descricao: string;
  pontosAula: number;
  dificuldade: string;
  conteudo: string;
  concluida: boolean;
  moduloId?: number;
  nomeModulo?: string;
}

export interface ModuloCompletoResponse {
  id: number;
  nome: string;
  tempoConclusao: string;
  descricao: string;
  aulas: AulaCompletaResponse[];
}

export interface TrilhaCompletaResponse {
  id: number;
  nome: string;
  descricao: string;
  petId: number;
  nomePet: string;
  modulos: ModuloCompletoResponse[];
}

export interface ConteudoAulaApiResponse {
  id: string;
  aulaId: number;
  tipoConteudo: string;
  corpoMarkdown: string;
  linksRecursos: string[];
  atualizadoEm?: string;
}
