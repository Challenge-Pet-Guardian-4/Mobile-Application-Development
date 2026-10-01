export type EnumStatus = 'PENDENTE' | 'CONCLUIDO' | 'EXPIRADO';

export interface TarefaRequest {
  titulo: string;
  pontosTarefa: number;
  descricao: string;
  prazo: string; // ISO 8601 LocalDateTime
  petId: number;
  status: EnumStatus;
  conclusao?: string | null;
}


export interface TarefaResponse {
  id: number;
  titulo: string;
  pontosTarefa: number;
  descricao: string;
  criacao: string;
  prazo: string;
  conclusao: string | null;
  status: EnumStatus;
  usuarioEmail: string | null;
  usuarioNome: string | null;
  petId: number;
}

export interface TaskFormData {
  petId: number;
  titulo: string;
  descricao: string;
  pontos: string;
  prazo?: string;
  status?: EnumStatus;
  conclusao?: string | null;
}
