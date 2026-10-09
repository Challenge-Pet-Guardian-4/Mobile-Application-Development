import { TarefaResponse } from './task';

export type PetPorte = 'PEQUENO' | 'MEDIO' | 'GRANDE';

export interface PetRequest {
  nome: string;
  dataNasc: string; // ISO format 'YYYY-MM-DD'
  raca: string;
  porte: PetPorte;
  sexo: string; // 'M' | 'F'
  castrado: boolean;
}

export interface PetResponse {
  id: number;
  nome: string;
  dataNasc: string; // ISO format 'YYYY-MM-DD'
  raca: string;
  porte: PetPorte;
  sexo: string;
  castrado: boolean;
}

export interface PetHistoryResponse {
  petId: number;
  nomePet: string;
  tarefasConcluidas: TarefaResponse[];
}

export interface CoCuidadorResponse {
  nome: string;
  email: string;
  petId: number;
  nomePet: string;
  responsavelPrincipal: boolean;
}

export interface CaregiverWithActions extends CoCuidadorResponse {
  isCurrentUser: boolean;
  onTransfer?: () => void;
  onRemove?: () => void;
}

export interface TransferirResponsabilidadeRequest {
  novoResponsavelEmail: string;
}

export interface PetPontuacaoResponse {
  petId: number;
  nomePet: string;
  pontosTarefas: number;
  pontosAulas: number;
  pontosTotais: number;
}

export interface PetPontuacaoAgregadaResponse {
  pontosTarefas: number;
  pontosAulas: number;
  pontosTotais: number;
  detalhePets: PetPontuacaoResponse[];
}

export interface PetFormData {
  nome: string;
  raca: string;
  dataNasc: string;
  porte: PetPorte;
  sexo: string;
  castrado: boolean;
}
