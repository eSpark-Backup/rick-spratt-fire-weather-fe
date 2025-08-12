import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { textColor } from '../constants/colors';
// import useTheme from '../theme/useTheme';

interface CustomTextProps extends TextProps {
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

const CustomText: React.FC<CustomTextProps> = ({
  text,
  children,
  style,
  fontFamily = 'Gilroy-SemiBold',
  size = 15,
  color,
  ...rest
}) => {
  //   const { colors } = useTheme();
  const content = children ?? text ?? '';

  return (
    <Text
      style={[
        styles.defaultText,
        {
          fontSize: size,
          fontFamily,
          color: color || textColor,
        },
        style,
      ]}
      {...rest}
    >
      {content}
    </Text>
  );
};

const styles = StyleSheet.create({
  defaultText: {
    color: '#333',
  },
});

export default CustomText;
