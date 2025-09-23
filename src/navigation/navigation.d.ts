import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  HomeTabs: undefined; // contains bottom tab
  ZoneSelection?: {
    fromScreen: 'Home' | 'SignUp';
    onSelect?: (zone: { id: string; name: string }) => void;
  };
};

export type RootStackNavigationProp<
  T extends keyof RootStackParamList = 'HomeTabs',
> = NativeStackNavigationProp<RootStackParamList, T>;

export type RootStackRouteProp<
  T extends keyof RootStackParamList = 'HomeTabs',
> = RouteProp<RootStackParamList, T>;

export type BottomTabParamList = {
  Home: undefined;
  Settings: undefined;
  Notifications: undefined;
};

export type BottomTabNavigationProp<
  T extends keyof BottomTabParamList = 'Home',
> = BottomTabNavigationProp<BottomTabParamList, T>;

export type BottomTabRouteProp<T extends keyof BottomTabParamList = 'Home'> =
  RouteProp<BottomTabParamList, T>;

export type CompositeNavProp = CompositeNavigationProp<
  BottomTabNavigationProp<BottomTabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;
