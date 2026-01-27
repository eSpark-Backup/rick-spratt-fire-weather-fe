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
import { RootStackNavigationProp, RootStackRouteProp } from '../../navigation/navigation';
import { resetPassword } from '../../services/authService';

type Props = {
  navigation: RootStackNavigationProp<'ResetPassword'>;
  route: RootStackRouteProp<'ResetPassword'>;
};

export default function ResetPasswordScreen({ navigation, route }: Props) {
  const { email, token } = route.params;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    let newErrors: Record<string, string> = {};
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 8) newErrors.password = 'Min 8 characters';
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password))
      newErrors.password = 'Must contain uppercase, lowercase and number';

    if (!confirmPassword) newErrors.confirmPassword = 'Confirm Password is required';
    else if (confirmPassword !== password) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResetPassword = async () => {
    if (validate()) {
      // Alert.alert('Success', 'Your password has been reset successfully.', [
      //   { text: 'Login Now', onPress: () => navigation.navigate('SignIn') }
      // ]);
      setLoading(true);
      try {
        console.log({
          resetToken:token,
          password,
          confirmPassword: password
        })
        const res = await resetPassword({
          resetToken:token,
          password,
          confirmPassword: password
        });
        console.log("resetPassword res", res)
        if (res.success) {
          Alert.alert('Success', 'Your password has been reset successfully.', [
            { text: 'Login Now', onPress: () => navigation.navigate('SignIn') }
          ]);
        } else {
          Alert.alert('Error', res.message || 'Failed to reset password');
        }
      } catch (err: any) {
        console.log("err", err)
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
          Reset Password
        </CustomText>
        <CustomText
          fontFamily="Gilroy-Medium"
          color={'#797777'}
          style={styles.description}
        >
          Set a strong password to secure your account
        </CustomText>

        <CustomInput
          label="New Password"
          placeholder="Enter new password"
          secureTextEntry
          value={password}
          onChangeText={text => {
            setPassword(text);
            if (errors.password) validate();
          }}
          error={errors.password}
        />

        <CustomInput
          label="Confirm Password"
          placeholder="Re-enter new password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={text => {
            setConfirmPassword(text);
            if (errors.confirmPassword) validate();
          }}
          error={errors.confirmPassword}
        />

        <View style={styles.buttonContainer}>
          {loading ? (
            <ActivityIndicator size="large" color={coolColor} />
          ) : (
            <CustomButton title="Reset Password" onPress={handleResetPassword} />
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
