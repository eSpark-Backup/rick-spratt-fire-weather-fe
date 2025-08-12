import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  View,
  ImageSourcePropType,
  GestureResponderEvent,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from './CustomText';

interface CustomButtonProps extends TouchableOpacityProps {
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

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  icon,
  backgroundColor,
  textColor,
  borderColor,
  borderWidth = 0,
  style,
  textStyle,
  gradient = true,
}) => {
  const ButtonContent = () => (
    <View style={styles.content}>
      {icon}
      <CustomText
        fontFamily="Gilroy-SemiBold"
        style={[
          styles.text,
          { color: textColor ? textColor : gradient ? '#fff' : '#000' },
          textStyle,
        ]}
      >
        {title}
      </CustomText>
    </View>
  );

  if (gradient) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <LinearGradient
          colors={['#4F7FFA', '#335FD1']}
          style={[styles.button, { borderColor, borderWidth }, style]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <ButtonContent />
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        { backgroundColor, borderColor: '#000000', borderWidth: 1 },
        style,
      ]}
      activeOpacity={0.8}
    >
      <ButtonContent />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CustomButton;
