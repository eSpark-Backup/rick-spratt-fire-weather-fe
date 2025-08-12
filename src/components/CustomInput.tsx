import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

import CustomText from './CustomText';
import { EyeClosed, EyeOpen } from '../assets';
import { brdrColor, textColor } from '../constants/colors';
import { CustomInputProps } from '../types';
// import useTheme from '../theme/useTheme';

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  error,
  hasError = false,
  style,
  bgColor = '#ECECEC',
  secureTextEntry = false,
  ...props
}) => {
  // const theme = useTheme();
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  return (
    <View style={styles.container}>
      {label && (
        <CustomText
          style={styles.label}
          // color={theme.dark ? '#e2e2e2' : '#333'}
          color="#797777"
          size={17}
        >
          {label}
        </CustomText>
      )}

      <View
        style={[
          styles.inputContainer,
          props.multiline && styles.inputContainerMultiline,
          hasError && styles.inputError,
          { backgroundColor: bgColor, borderColor: brdrColor },
          style,
        ]}
      >
        <TextInput
          style={[
            styles.input,
            props.multiline && styles.multilineInput,
            hasError && styles.inputTextError,
            {
              color: textColor,
              // color: theme.dark ? '#efefef' : '#333',
              fontFamily: 'Gilroy-Medium',
              fontSize: 16,
            },
          ]}
          secureTextEntry={!isPasswordVisible && secureTextEntry}
          placeholderTextColor={hasError ? '#E74C3C' : '#9CA5AC'}
          {...props}
        />

        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(prev => !prev)}
            style={{ padding: 5 }}
          >
            {isPasswordVisible ? <EyeOpen /> : <EyeClosed />}
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <CustomText style={styles.errorText} size={12}>
          {error}
        </CustomText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 57,
    borderRadius: 14,
  },
  inputError: {
    borderColor: '#E74C3C',
    backgroundColor: '#FFF5F5',
  },
  input: {
    flex: 1,
    color: '#333',
  },
  inputTextError: {
    color: '#E74C3C',
  },
  errorText: {
    color: '#E74C3C',
    marginTop: 4,
  },
  inputContainerMultiline: {
    alignItems: 'flex-start',
    paddingTop: 12,
  },
  multilineInput: {
    textAlignVertical: 'top',
    paddingTop: 0,
  },
});

export default CustomInput;
