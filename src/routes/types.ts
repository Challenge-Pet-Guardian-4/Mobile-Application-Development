import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
};

export type FamilyStackParamList = {
  FamilyMain: undefined;
  PetDetail: { petId?: number } | undefined;
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  PetDetail: { petId?: number } | undefined;
};

export type AppTabParamList = {
  Home: undefined;
  Family: NavigatorScreenParams<FamilyStackParamList> | undefined;
  IA: { petId?: number } | undefined;
  Treino: undefined;
  Perfil: NavigatorScreenParams<ProfileStackParamList> | undefined;
};

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  Tabs: NavigatorScreenParams<AppTabParamList> | undefined;
  Family: NavigatorScreenParams<FamilyStackParamList> | undefined;
  IA: { petId?: number } | undefined;
  Perfil: NavigatorScreenParams<ProfileStackParamList> | undefined;
};

