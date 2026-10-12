import { PetResponse, PetComMetadados } from '../types/pet';
import { TarefaResponse } from '../types/task';
import { CuidadorResumo, CuidadorFamiliarItem, RedeCuidadoResponse, UsuarioResponse, CurrentUserCaregiver, FamilySummary } from '../types/user';
import { formatarPapelCuidador } from './petUtils';

/**
 * Mescla a lista base de animais com os dados de titularidade da rede de cuidado
 * e pontuação consolidada do Oracle Database.
 */
export function mesclarPetsComMetadados(
  pets: PetResponse[],
  redeCuidado?: RedeCuidadoResponse,
  pontosMap?: Map<number, number>
): PetComMetadados[] {
  const resumoMap = new Map((redeCuidado?.pets || []).map((p) => [p.id, p]));

  return pets.map((p) => {
    const resumo = resumoMap.get(p.id);
    return {
      ...p,
      isResponsavelPrincipal: resumo?.responsavelPrincipal ?? true,
      tarefasCount: resumo?.totalTarefas,
      pontosTotais: pontosMap?.get(p.id),
    };
  });
}

/**
 * Formata os co-cuidadores vinculados à família, determinando papéis
 * e lista de animais cuidados como titular ou co-cuidador de apoio.
 */
export function formatarListaCoCuidadores(
  coCuidadores: CuidadorResumo[],
  pets: Array<Pick<PetResponse, 'id' | 'nome'>>,
  petsOndeSouPrincipal: Array<Pick<PetResponse, 'id' | 'nome'>>
): CuidadorFamiliarItem[] {
  const principalIdsSet = new Set(petsOndeSouPrincipal.map((p) => p.id));

  return coCuidadores.map((c) => {
    let principalNomes = c.petsPrincipalNomes;
    let ajudaNomes = c.petsAjudaNomes;

    if (!principalNomes || !ajudaNomes) {
      const cPetIds = c.petIds ?? [];
      const cPrincipal: string[] = [];
      const cAjuda: string[] = [];

      cPetIds.forEach((id) => {
        const petObj = pets.find((p) => p.id === id);
        if (!petObj) return;
        if (principalIdsSet.has(id)) {
          cAjuda.push(petObj.nome);
        } else {
          cPrincipal.push(petObj.nome);
        }
      });

      principalNomes = principalNomes ?? cPrincipal;
      ajudaNomes = ajudaNomes ?? cAjuda;
    }

    const isPrincipal = (principalNomes?.length ?? 0) > 0 || Boolean(c.responsavelPrincipal);

    return {
      ...c,
      responsavelPrincipal: isPrincipal,
      roleText: formatarPapelCuidador(isPrincipal, principalNomes, ajudaNomes),
    };
  });
}

/**
 * Constrói o cartão de perfil do próprio tutor autenticado dentro da rede de cuidado.
 */
export function construirCuidadorUsuarioLogado(
  user: UsuarioResponse | null,
  pets: Array<Pick<PetResponse, 'id' | 'nome'>>,
  petsOndeSouPrincipal: Array<Pick<PetResponse, 'id' | 'nome'>>
): CurrentUserCaregiver | null {
  if (!user) return null;

  const petsPrincipalNomes = petsOndeSouPrincipal.map((p) => p.nome).filter(Boolean);
  const petsAjudaNomes = pets
    .filter((p) => !petsOndeSouPrincipal.some((op) => op.id === p.id))
    .map((p) => p.nome)
    .filter(Boolean);
  const isPrincipal = petsPrincipalNomes.length > 0;

  return {
    nome: user.nome || 'Tutor',
    email: user.email,
    isPrincipal,
    roleText: formatarPapelCuidador(isPrincipal, petsPrincipalNomes, petsAjudaNomes),
  };
}

/**
 * Constrói o resumo quantitativo da família (totais de tarefas e pontuação acumulada)
 * utilizando prioritariamente os dados consolidados pelas Stored Procedures Oracle.
 */
export function construirResumoFamiliar(
  user: UsuarioResponse | null,
  petsCount: number,
  redeCuidado?: RedeCuidadoResponse,
  allTasks: TarefaResponse[] = []
): FamilySummary {
  return {
    tutorNome: user?.nome,
    petsCount,
    tarefasPendentes: redeCuidado?.totalTarefasPendentes ?? allTasks.filter((t) => t.status === 'PENDENTE').length,
    tarefasConcluidas: redeCuidado?.totalTarefasConcluidas ?? 0,
    pontosAcumulados: redeCuidado?.pontosAcumulados ?? 0,
  };
}

export interface GamificationBadgeConfig {
  label: string;
  bg: string;
  border: string;
  text: string;
}

/**
 * Retorna a configuração visual do badge do nível de gamificação do tutor.
 */
export function obterBadgeGamificacao(nivel?: string): GamificationBadgeConfig {
  const norm = nivel?.toUpperCase();
  if (norm === 'OURO') {
    return { label: '🥇 Ouro', bg: '#FEF3C7', border: '#FCD34D', text: '#B45309' };
  }
  if (norm === 'PRATA') {
    return { label: '🥈 Prata', bg: '#F1F5F9', border: '#CBD5E1', text: '#334155' };
  }
  return { label: '🥉 Bronze', bg: '#FFEDD5', border: '#FED7AA', text: '#9A3412' };
}

