import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { shadows } from '../utils/shadow';
import { AppTabParamList, FamilyStackParamList, ProfileStackParamList } from './types';
import Home from '../screens/Home/HomeScreen';
import FamilyPetScreen from '../screens/FamilyPet/FamilyPetScreen';
import PetDetailScreen from '../screens/PetDetail/PetDetailScreen';
import TrainingEducationScreen from '../screens/TrainingEducation/TrainingEducationScreen';
import UserProfileScreen from '../screens/UserProfile/UserProfileScreen';
import AiAssistantScreen from '../screens/AiAssistant/AiAssistantScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, useThemedStyles } from '../contexts/ThemeContext';
import { AppTheme } from '../constants/theme';

const Tab = createBottomTabNavigator<AppTabParamList>();
const FamilyStackNav = createNativeStackNavigator<FamilyStackParamList>();
const ProfileStackNav = createNativeStackNavigator<ProfileStackParamList>();

function FamilyStack() {
  return (
    <FamilyStackNav.Navigator screenOptions={{ headerShown: false }}>
      <FamilyStackNav.Screen name="FamilyMain" component={FamilyPetScreen} />
      <FamilyStackNav.Screen name="PetDetail" component={PetDetailScreen} />
    </FamilyStackNav.Navigator>
  );
}

function ProfileStack() {
  return (
    <ProfileStackNav.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStackNav.Screen name="ProfileMain" component={UserProfileScreen} />
      <ProfileStackNav.Screen name="PetDetail" component={PetDetailScreen} />
    </ProfileStackNav.Navigator>
  );
}

export default function Tabs() {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();

  // Eleva a barra de navegação para que fique SEMPRE acima dos botões nativos do Android (||| O <)
  const bottomOffset = insets.bottom > 0
    ? insets.bottom + 8
    : (Platform.OS === 'ios' ? 24 : 14);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: [styles.tabBar, { bottom: bottomOffset }],
        tabBarActiveTintColor: theme.tabBarActive,
        tabBarInactiveTintColor: theme.tabBarInactive,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home-variant" color={color} size={size + 2} />
          ),
        }}
      />

      <Tab.Screen
        name="Family"
        component={FamilyStack}
        options={{
          tabBarLabel: 'Family',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-group" color={color} size={size + 2} />
          ),
        }}
      />

      {/* BOTÃO CENTRAL DEDICADO PARA A IA ASSISTENTE */}
      <Tab.Screen
        name="IA"
        component={AiAssistantScreen}
        options={{
          tabBarStyle: { display: 'none' },
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <View style={[styles.centerButton, focused && styles.centerButtonActive]}>
              <MaterialCommunityIcons
                name="robot-confused-outline"
                size={28}
                color="#FFFFFF"
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Treino"
        component={TrainingEducationScreen}
        options={{
          tabBarLabel: 'Educação',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="school" color={color} size={size + 2} />
          ),
        }}
      />

      <Tab.Screen
        name="Perfil"
        component={ProfileStack}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-circle" color={color} size={size + 2} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    tabBar: {
      backgroundColor: theme.tabBarBg,
      borderColor: theme.tabBarBorder,
      borderWidth: theme.isDark ? 1 : 0,
      bottom: Platform.OS === 'ios' ? 24 : 14,
      marginHorizontal: 16,
      borderRadius: 24,
      borderTopWidth: 0,
      elevation: 10,
      ...shadows.xxl,
      height: 64,
      position: 'absolute',
      paddingBottom: Platform.OS === 'ios' ? 10 : 8,
      paddingTop: 8,
    },
    tabBarLabel: {
      fontSize: 11,
      fontWeight: '700',
    },
    centerButton: {
      width: 58,
      height: 58,
      backgroundColor: '#1E293B',
      borderRadius: 29,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Platform.OS === 'android' ? 20 : 16,
      borderWidth: 3.5,
      borderColor: '#0F172A',
      ...shadows.colored('#000000', 0.25),
      elevation: 6,
    },
    centerButtonActive: {
      backgroundColor: '#2563EB',
      ...shadows.colored('#2563EB', 0.4),
    },
  });