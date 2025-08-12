import React, { useState } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import { RootStackNavigationProp } from '../../navigation/navigation';
import CustomText from '../../components/CustomText';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import RadioButton from '../../components/RadioButton';
import { bgColor } from '../../constants/colors';

type Props = { navigation: RootStackNavigationProp<'SignIn'> };

export default function SignInScreen({ navigation }: Props) {
  const [selected, setSelected] = useState(false);

  const handleLogin = () => {
    navigation.replace('HomeTabs');
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        // { backgroundColor: theme.colors.background }
        // { backgroundColor: '#fff' },
      ]}
    >
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
        />
        <CustomInput
          label="Password"
          placeholder="Enter your password"
          secureTextEntry
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
          <CustomButton
            title="Login"
            onPress={handleLogin}
            textStyle={styles.loginButtonText}
          />

          <View style={styles.linkContainer}>
            <CustomText
            // color={theme.dark ? '#999' : '#666'}
            >
              Don’t have an account?
            </CustomText>
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
    padding: 20,
    backgroundColor: bgColor,
  },
  keyboardView: {
    flex: 1,
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
