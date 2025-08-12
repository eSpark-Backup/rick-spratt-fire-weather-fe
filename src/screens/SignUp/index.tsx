import React, { useState } from 'react';
import {
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  StyleSheet,
} from 'react-native';
import CustomText from '../../components/CustomText';
import CustomInput from '../../components/CustomInput';
import { RootStackNavigationProp } from '../../navigation/navigation';
import CustomButton from '../../components/CustomButton';
import CustomDropdown from '../../components/CustomDropdown';
import { bgColor } from '../../constants/colors';
import { zoneData } from '../../constants';
import SuccessModal from '../../components/SuccessModal';

type Props = { navigation: RootStackNavigationProp<'SignUp'> };

export default function SignUpScreen({ navigation }: Props) {
  const [step, setStep] = useState(1);

  // Step 1 form data
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');

  const [selectedZone, setSelectedZone] = useState<string | undefined>();
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            {/* Title & Description */}
            {step === 1 ? (
              <>
                <CustomText
                  size={23}
                  fontFamily="Gilroy-Bold"
                  style={styles.title}
                >
                  Sign Up
                </CustomText>
                <CustomText
                  size={23}
                  fontFamily="Gilroy-Bold"
                  style={styles.subtitle}
                >
                  Create new account
                </CustomText>
                <CustomText
                  fontFamily="Gilroy-Medium"
                  color={'#797777'}
                  style={styles.description}
                >
                  Enter the details below accurately
                </CustomText>
              </>
            ) : (
              <>
                <CustomText
                  size={23}
                  fontFamily="Gilroy-Bold"
                  style={styles.title}
                >
                  Select Zone
                </CustomText>
              </>
            )}

            {/* Step 1 Inputs */}
            {step === 1 && (
              <>
                <CustomInput
                  label="First Name"
                  placeholder="Enter your first name"
                  value={firstName}
                  onChangeText={setFirstName}
                />
                <CustomInput
                  label="Last Name"
                  placeholder="Enter your last name"
                  value={lastName}
                  onChangeText={setLastName}
                />
                <CustomInput
                  label="Email Address"
                  placeholder="Enter your email address"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                />
                <CustomInput
                  label="Password"
                  placeholder="Enter your password"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
                <CustomInput
                  label="Country"
                  placeholder="Enter your country"
                  value={country}
                  onChangeText={setCountry}
                />
                <CustomInput
                  label="State"
                  placeholder="Enter your state"
                  value={state}
                  onChangeText={setState}
                />
              </>
            )}

            <View
              style={{
                flex: 1,
                justifyContent: 'space-between',
              }}
            >
              {/* Step 2 Inputs */}
              {step === 2 && (
                <View
                  style={{
                    marginTop: 20,
                  }}
                >
                  <CustomText
                    size={17}
                    fontFamily="Gilroy-Medium"
                    color="#797777"
                    style={{ marginBottom: 10 }}
                  >
                    Choose your Zone
                  </CustomText>

                  <CustomDropdown
                    data={zoneData}
                    placeholder="Select Zone"
                    selectedValue={selectedZone}
                    onSelect={item => setSelectedZone(item.value)}
                    maxHeight={500}
                  />
                </View>
              )}

              <View style={styles.bottomButtonContainer}>
                <CustomButton
                  title={step === 1 ? 'Next' : 'Create New Account'}
                  onPress={() => {
                    if (step === 1) {
                      setStep(2);
                    } else {
                      setSuccessModalVisible(true);
                      // navigation.navigate('HomeTabs');
                    }
                  }}
                />
              </View>
            </View>
          </View>
          <SuccessModal
            visible={isSuccessModalVisible}
            onGoHome={() => {
              setSuccessModalVisible(false);
              navigation.navigate('HomeTabs');
            }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: bgColor,
  },
  keyboardAvoiding: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 20,
    flexGrow: 1,
    // paddingBottom: 100,
    // justifyContent: 'space-between',
  },
  container: {
    // flexGrow: 1,
    flex: 1,
    // justifyContent: 'center',
  },
  title: {
    paddingVertical: '5%',
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  bottomButtonContainer: {
    padding: 20,
    // backgroundColor: bgColor,
  },
});
