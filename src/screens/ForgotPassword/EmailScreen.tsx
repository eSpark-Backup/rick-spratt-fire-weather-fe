import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import CustomText from '../../components/CustomText';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { bgColor, coolColor } from '../../constants/colors';
import { RootStackNavigationProp } from '../../navigation/navigation';
import { forgotPassword } from '../../services/authService';

type Props = { navigation: RootStackNavigationProp<'ForgotPasswordEmail'> };

export default function ForgotPasswordEmailScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (val: string) => {
    if (!val) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) return 'Enter a valid email';
    return '';
  };

  const handleSendOTP = async () => {
    const err = validateEmail(email);
    setError(err);
    if (!err) {
        // navigation.navigate('ForgotPasswordOTP', { email: email.toLowerCase() });
      setLoading(true);
      try {
        const res = await forgotPassword(email.toLowerCase());
        console.log("forgotPassword res", res)
        if (res.success) {
          navigation.navigate('ForgotPasswordOTP', { email: email.toLowerCase() });
        } else {
          Alert.alert('Error', res.message || 'Failed to send OTP');
        }
      } catch (err: any) {
        Alert.alert('Error', err.response?.data?.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <CustomText size={23} fontFamily="Gilroy-Bold" style={styles.title}>
          Forgot Password
        </CustomText>
        <CustomText
          fontFamily="Gilroy-Medium"
          color={'#797777'}
          style={styles.description}
        >
          Enter your email address to receive an OTP for password reset
        </CustomText>

        <CustomInput
          label="Email Address"
          placeholder="Enter your email address"
          keyboardType="email-address"
          value={email}
          onChangeText={text => {
            setEmail(text);
            if (error) setError(validateEmail(text));
          }}
          error={error}
        />

        <View style={styles.buttonContainer}>
          {loading ? (
            <ActivityIndicator size="large" color={coolColor} />
          ) : (
            <CustomButton title="Send OTP" onPress={handleSendOTP} />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: bgColor,
  },
  keyboardView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    paddingVertical: '5%',
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    marginBottom: 30,
    color: '#797777',
  },
  buttonContainer: {
    marginTop: 20,
  },
});
