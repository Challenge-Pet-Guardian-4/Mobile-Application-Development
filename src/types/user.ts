export type UsuarioRole = 'COMUM' | 'PREMIUM';

export interface EnderecoRequest {
  cep: string;
  numero: string;
}

export interface EnderecoResponse {
  id: number;
  cep: string;
  numero: string;
  rua: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export interface UsuarioRequest {
  nome: string;
  email: string;
  senha: string;
  ddd: string;
  numeroTelefone: string;
  endereco: EnderecoRequest;
}

export interface UsuarioResponse {
  id: number;
  nome: string;
  email: string;
  role: UsuarioRole;
  ddd: string;
  numeroTelefone: string;
  endereco: EnderecoResponse;
}

export interface PetResumo {
  id: number;
  nome: string;
  raca: string;
  responsavelPrincipal: boolean;
  tarefaIds: number[];
}

export interface CuidadorResumo {
  nome: string;
  email: string;
  responsavelPrincipal: boolean;
  petIds: number[];
  petNomes: string[];
  petsPrincipalNomes?: string[];
  petsAjudaNomes?: string[];
}

export interface CuidadorFamiliarItem extends CuidadorResumo {
  roleText: string;
}

export interface RedeCuidadoResponse {
  emailUsuario: string;
  nomeUsuario: string;
  pets: PetResumo[];
  coCuidadores: CuidadorResumo[];
  totalTarefasPendentes: number;
  totalTarefasConcluidas: number;
  pontosAcumulados: number;
}

export interface InviteCaregiverData {
  email: string;
  petId: number;
}

export interface EditProfileFormData {
  nome: string;
  email: string;
  ddd: string;
  numeroTelefone: string;
  cep: string;
  numero: string;
  senha: string;
}
