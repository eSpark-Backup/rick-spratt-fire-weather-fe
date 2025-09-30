import React, { useEffect, useState } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { RootStackNavigationProp } from '../../navigation/navigation';
import CustomText from '../../components/CustomText';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import RadioButton from '../../components/RadioButton';
import { bgColor, coolColor, tempColor } from '../../constants/colors';

import { login, updateDeviceToken } from '../../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setIsLoggedIn, setUser } from '../../redux/slices/authSlice';
import getDeviceToken from '../../utils/getDeviceToken';
import crashlytics from '@react-native-firebase/crashlytics';

type Props = { navigation: RootStackNavigationProp<'SignIn'> };

const CREDENTIALS_KEY = 'rememberedUser';

export default function SignInScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [selected, setSelected] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const loadRememberedCredentials = async () => {
    const saved = await AsyncStorage.getItem(CREDENTIALS_KEY);
    if (saved) {
      const { email, password } = JSON.parse(saved);
      setEmail(email);
      setPassword(password);
      setSelected(true); // toggle Remember Me
    }
  };
  useEffect(() => {
    loadRememberedCredentials();
  }, []);

  const validateEmail = (value: string) => {
    if (!value) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Enter a valid email';
    return '';
  };

  const validatePassword = (value: string) => {
    if (!value) return 'Password is required';
    if (value.length < 8) return 'Password must be at least 8 characters';
    return '';
  };

  const handleLogin = async () => {
    crashlytics().crash(); // Test crash
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);

    setEmailError(emailErr);
    setPasswordError(passErr);

    if (!emailErr && !passErr) {
      try {
        setLoading(true);
        const response = await login({ email: email.toLowerCase(), password });
        console.log('on sigin:', response);
     
        if (response.success) {
          const userData = response.data;
          const { token } = userData;
          console.log("userData", userData);
          crashlytics().log('User signed in.');
          await Promise.all([
            crashlytics().setUserId(userData?.id ?? 'unknown'),
            crashlytics().setAttributes({
              email: email,
              username: userData.username || 'N/A',
            }),
          ]);
          // 1. Save token immediately
          await AsyncStorage.setItem('authToken', token);
          dispatch(setUser(userData));
          dispatch(setIsLoggedIn(true));

          // 2. Get FCM token and update backend
          const fcmToken = await getDeviceToken();
          try {
            await updateDeviceToken(fcmToken!); // now interceptor has the token ✅
          } catch (err) {
            console.warn('[Login] Failed to update device token:', err);
          }

          // 3. Save credentials if Remember Me selected
          if (selected) {
            await AsyncStorage.setItem(
              CREDENTIALS_KEY,
              JSON.stringify({ email, password }),
            );
          } else {
            await AsyncStorage.removeItem(CREDENTIALS_KEY);
          }

          await AsyncStorage.setItem('isUserLoggedIn', 'true');
          navigation.replace('HomeTabs');
        } else {
          Alert.alert(
            'Login Failed',
            response.message || 'Something went wrong',
          );
        }
      } catch (error: any) {
        console.log('Login error:', error);
        if (error?.response?.status === 401) {
          Alert.alert('Login Failed', 'Incorrect credentials');
        } else {
          Alert.alert(
            'Login Failed',
            error?.message || 'Invalid credentials. Please try again.',
          );
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  const isFormValid = !validateEmail(email) && !validatePassword(password);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <CustomText size={23} fontFamily="Gilroy-Bold" style={styles.title}>
          Login
        </CustomText>

        <CustomInput
          label="Email Address"
          placeholder="Enter your email address"
          keyboardType="email-address"
          value={email}
          onChangeText={text => {
            setEmail(text);
            if (emailError) setEmailError(validateEmail(text));
          }}
          error={emailError} // assuming CustomInput can show error text
        />

        <CustomInput
          label="Password"
          placeholder="Enter your password"
          secureTextEntry
          value={password}
          onChangeText={text => {
            setPassword(text);
            if (passwordError) setPasswordError(validatePassword(text));
          }}
          error={passwordError}
        />

        <View style={styles.rememberMeContainer}>
          <RadioButton
            selected={selected}
            onPress={() => setSelected(!selected)}
          />
          <CustomText size={17} color="#797777">
            Remember Me
          </CustomText>
        </View>

        <View style={styles.buttonContainer}>
          {loading ? (
            <ActivityIndicator
              size="large"
              color={coolColor}
              style={{ marginBottom: '6.5%' }}
            />
          ) : (
            <CustomButton
              title="Login"
              onPress={handleLogin}
              textStyle={styles.loginButtonText}
              disabled={!isFormValid}
            />
          )}
          <View style={styles.linkContainer}>
            <CustomText>Don’t have an account?</CustomText>
            <TouchableOpacity onPress={handleSignUp}>
              <CustomText style={styles.link}> Sign Up</CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 20,
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
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingBottom: '22%',
    paddingTop: 10,
  },
  buttonContainer: {
    paddingHorizontal: 20,
  },
  loginButtonText: {
    fontSize: 19,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  link: {
    color: '#335FD1',
    fontWeight: '500',
  },
});
