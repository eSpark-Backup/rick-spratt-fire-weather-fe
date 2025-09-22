import {
  DimensionValue,
  GestureResponderEvent,
  TextInputProps,
  TextProps,
  TextStyle,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';

export type BaseSetting = {
  icon: React.ReactElement;
  title: string;
  rightValue: string;
  key: string;
  color?: string;
};

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: string;
  severity: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  icon?: React.ReactNode;
}

export type ValueSetting = BaseSetting & {
  value: number;
  minValue?: undefined;
  maxValue?: undefined;
};

export type KBDISetting = BaseSetting & {
  minValue: number;
  maxValue: number;
  value?: undefined;
};

export type Setting = ValueSetting | KBDISetting;

export interface ColoredTileProps {
  color: string;
  children: React.ReactNode;
  style?: ViewStyle;
  activeOpacity?: number;
  onPress?: () => void;
}

export interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  icon?: React.ReactNode;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  borderWidth?: number;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle;
  gradient?: boolean;
}

export type DropdownProps = {
  data: DropdownItem[];
  placeholder?: string;
  onSelect: (item: DropdownItem) => void;
  selectedValue?: string;
  maxHeight?: number;
  error?: string;
  hasError?: boolean;
};

export interface CustomInputProps extends TextInputProps {
  label?: string;
  error?: string;
  hasError?: boolean;
  style?: ViewStyle;
  bgColor?: string;
}

export interface CustomTabBarProps {
  navigation: any;
  state: any;
}

export interface CustomTextProps extends TextProps {
  text?: string;
  children?: React.ReactNode;
  fontFamily?:
    | 'Gilroy-Bold'
    | 'Gilroy-ExtraBold'
    | 'Gilroy-Medium'
    | 'Gilroy-Regular'
    | 'Gilroy-SemiBold';
  size?: number;
  color?: string;
}

export interface CustomTileProps {
  icon: React.ReactNode;
  title: string;
  rightValue: string;
  color?: string;
  activeOpacity?: number;
  onPress?: () => void;
}

export type DropdownItem = {
  label: string;
  value: string;
};

export type DropdownModalProps = {
  visible: boolean;
  onClose: () => void;
  data: DropdownItem[];
  selectedValue?: string;
  onSelect: (item: DropdownItem) => void;
  position?: { top: number; left: number; width: number };
  maxHeight?: number;
  width?: DimensionValue;
};

export interface HeaderProps {
  username: string;
  locations: {
    label: string;
    value: string;
  }[];
  onLocationSelect: (location: string) => void;
  LeftIcon?: React.ReactNode;
  onLeftPress?: () => void;
}

export interface NotificationTileProps {
  icon: React.ReactNode;
  message: string;
  time: string;
  color?: string;
  onPress?: () => void;
}

export interface RadioButtonProps {
  selected?: boolean;
  onPress: () => void;
}

export type SettingEdit = {
  icon: React.ReactNode;
  title: string;
  rightValue?: string;
  value: number;
  minValue?: number;
  maxValue?: number;
  key: string;
  type?: 'value' | 'range';
};

export type SettingsEditModalProps = {
  visible: boolean;
  setting: SettingEdit | null;
  onClose: () => void;
  onValueChange?: (
    key: string,
    value: number | { min: number; max: number },
  ) => void;
};

export type SuccessModalProps = {
  visible: boolean;
  onGoHome: () => void;
};
