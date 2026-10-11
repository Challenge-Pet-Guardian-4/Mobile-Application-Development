import React from 'react';
import { View, StyleSheet, ScrollView, Platform, RefreshControl } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Header } from '../../components/Header';
import { FaqModal } from './components/FaqModal';
import { TermsModal } from './components/TermsModal';
import { EditProfileModal } from '../../components/EditProfileModal';
import { useUserProfile } from '../../hooks/useUserProfile';
import { RootStackParamList } from '../../routes/types';
import { PerfilUsuarioCard } from './components/PerfilUsuarioCard';
import { UpgradePremiumCard } from './components/UpgradePremiumCard';
import { UpgradePremiumModal } from './components/UpgradePremiumModal';
import { EstatisticasPerfil } from './components/EstatisticasPerfil';
import { RedeFamiliarECuidadores } from './components/RedeFamiliarECuidadores';
import { RecursosPetGuardian } from './components/RecursosPetGuardian';
import { ContaESuporte } from './components/ContaESuporte';
import { NotificationSettingsModal } from './components/NotificationSettingsModal';
import { SobreAppModal } from './components/SobreAppModal';
import { useNotifications } from '../../hooks/useNotifications';
import { useTheme } from '../../hooks/useTheme';

interface UserProfileScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

export default function UserProfileScreen({ navigation }: UserProfileScreenProps) {
  const { status, profile, modals, actions } = useUserProfile();
  const { settings } = useNotifications();
  const { theme } = useTheme();

  const subtituloNotificacoes = settings.ativado
    ? `Lembretes ativos • ${settings.minutosAntecedencia === 0 ? 'No horário' : `${settings.minutosAntecedencia} min antes`}`
    : 'Lembretes desativados';

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={status.isFetching && !status.isLoading}
            onRefresh={actions.refetch}
            tintColor={theme.primary}
          />
        }
      >
        <Header subtitle="Meu Perfil & Configurações" />

        {/* Card Principal do Usuário */}
        <PerfilUsuarioCard
          profile={profile}
          onEdit={() => modals.abrir('editar')}
          onUpgrade={() => modals.abrir('upgrade')}
          isUpgrading={actions.isUpgradingPremium}
        />

        {/* Card Destaque de Upgrade / Status do Plano Premium */}
        <UpgradePremiumCard
          role={profile.user?.role}
          onUpgradePress={() => modals.abrir('upgrade')}
          isUpgrading={actions.isUpgradingPremium}
        />

        {/* Estatísticas Gamificadas */}
        <EstatisticasPerfil profile={profile} />

        {/* Rede Familiar & Cuidadores */}
        <RedeFamiliarECuidadores profile={profile} navigation={navigation} />

        {/* Recursos & Ferramentas do Ecossistema */}
        <RecursosPetGuardian navigation={navigation} />

        {/* Conta, Tema, Sobre o App, FAQ, Termos, Notificações, Logout e Exclusão de Conta */}
        <ContaESuporte
          onOpenNotifications={() => modals.abrir('notificacoes')}
          notificationSubtitle={subtituloNotificacoes}
          onOpenSobreApp={() => modals.abrir('sobre')}
          onOpenFaq={() => modals.abrir('faq')}
          onOpenTerms={() => modals.abrir('termos')}
          onLogout={actions.logout}
          onDeleteAccount={actions.excluirConta}
        />

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Modais de Suporte, Edição de Perfil, Preferências de Notificações, Sobre o App e Upgrade Premium */}
      <NotificationSettingsModal
        visible={modals.ativo === 'notificacoes'}
        onClose={modals.fechar}
      />

      <SobreAppModal
        visible={modals.ativo === 'sobre'}
        onClose={modals.fechar}
      />

      <EditProfileModal
        visible={modals.ativo === 'editar'}
        onClose={modals.fechar}
        initialData={modals.initialFormData}
        isLoading={actions.isUpdating}
        onSubmit={actions.salvarPerfil}
      />

      <UpgradePremiumModal
        visible={modals.ativo === 'upgrade'}
        onClose={modals.fechar}
        onConfirm={actions.realizarUpgradePremium}
        isLoading={actions.isUpgradingPremium}
      />

      <FaqModal visible={modals.ativo === 'faq'} onClose={modals.fechar} />

      <TermsModal visible={modals.ativo === 'termos'} onClose={modals.fechar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingTop: Platform.OS === 'ios' ? 50 : 25,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    gap: 16,
  },
});