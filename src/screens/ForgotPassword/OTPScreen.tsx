import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import CustomText from '../../components/CustomText';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { bgColor, coolColor } from '../../constants/colors';
import { RootStackNavigationProp, RootStackRouteProp } from '../../navigation/navigation';
import { verifyOTP, forgotPassword } from '../../services/authService';

type Props = {
  navigation: RootStackNavigationProp<'ForgotPasswordOTP'>;
  route: RootStackRouteProp<'ForgotPasswordOTP'>;
};

export default function ForgotPasswordOTPScreen({ navigation, route }: Props) {
  const { email } = route.params;
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');

  const validateOTP = (val: string) => {
    if (!val) return 'OTP is required';
    if (val.length < 6) return 'OTP must be 6 digits'; // Assuming 6 digits
    return '';
  };

  const handleVerifyOTP = async () => {
    const err = validateOTP(otp);
    setError(err);
    if (!err) {
        // navigation.navigate('ResetPassword', { email, token: 'res.token'});
      setLoading(true);
      try {
        const res = await verifyOTP(email, otp);
        console.log('verifyOTP res', res);
        if (res.success) {
          // Backend should return a short-lived resetToken or we just pass email/otp to next screen if backend expects it
          // Assuming backend returns { success: true, token: 'resetToken' }
          navigation.navigate('ResetPassword', { email, token: res?.data?.resetToken || otp });
        } else {
          Alert.alert('Error', res.message || 'Verification failed');
        }
      } catch (err: any) {
        Alert.alert('Error', err.response?.data?.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleResendOTP = async () => {
    setResending(true);
    try {
        const res = await forgotPassword(email);
        if (res.success) {
            Alert.alert('Success', 'A new OTP has been sent to your email.');
        } else {
            Alert.alert('Error', res.message || 'Failed to resend OTP');
        }
    } catch (err: any) {
        Alert.alert('Error', err.response?.data?.message || 'Something went wrong');
    } finally {
        setResending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <CustomText size={23} fontFamily="Gilroy-Bold" style={styles.title}>
          Verify OTP
        </CustomText>
        <CustomText
          fontFamily="Gilroy-Medium"
          color={'#797777'}
          style={styles.description}
        >
          Enter the 6-digit code sent to {email}
        </CustomText>

        <CustomInput
          label="One-Time Password"
          placeholder="Enter 6-digit OTP"
          keyboardType="number-pad"
          maxLength={6}
          value={otp}
          onChangeText={text => {
            setOtp(text);
            if (error) setError(validateOTP(text));
          }}
          error={error}
        />

        <View style={styles.buttonContainer}>
          {loading ? (
            <ActivityIndicator size="large" color={coolColor} />
          ) : (
            <CustomButton title="Verify" onPress={handleVerifyOTP} />
          )}
        </View>

        <View style={styles.resendContainer}>
            <CustomText color="#797777">Didn't receive code? </CustomText>
            {resending ? (
                <ActivityIndicator size="small" color={coolColor} />
            ) : (
                <TouchableOpacity onPress={handleResendOTP}>
                    <CustomText color="#335FD1" fontFamily="Gilroy-Bold">Resend</CustomText>
                </TouchableOpacity>
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
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  }
});
