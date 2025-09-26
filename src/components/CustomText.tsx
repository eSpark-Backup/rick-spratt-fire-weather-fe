import React from 'react';
import { Text, StyleSheet } from 'react-native';

import { textColor } from '../constants/colors';
import { CustomTextProps } from '../types';
// import useTheme from '../theme/useTheme';

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
      adjustsFontSizeToFit
      allowFontScaling={false}
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
