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

  // Form data
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [selectedZone, setSelectedZone] = useState<string | undefined>();

  // Error state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Modal state
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);

  const validateStep1 = () => {
    let newErrors: Record<string, string> = {};
    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = 'Invalid email';
    if (!password.trim()) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Min 6 characters';
    if (!country.trim()) newErrors.country = 'Country is required';
    if (!state.trim()) newErrors.state = 'State is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    let newErrors: Record<string, string> = {};
    if (!selectedZone) newErrors.zone = 'Please select a zone';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextOrSubmit = () => {
    if (step === 1) {
      if (validateStep1()) setStep(2);
    } else {
      if (validateStep2()) setSuccessModalVisible(true);
    }
  };

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
            {/* Step Titles */}
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
              <CustomText
                size={23}
                fontFamily="Gilroy-Bold"
                style={styles.title}
              >
                Select Zone
              </CustomText>
            )}

            {/* Step 1 Inputs */}
            {step === 1 && (
              <>
                <CustomInput
                  label="First Name"
                  placeholder="Enter your first name"
                  value={firstName}
                  onChangeText={setFirstName}
                  error={errors.firstName}
                />
                <CustomInput
                  label="Last Name"
                  placeholder="Enter your last name"
                  value={lastName}
                  onChangeText={setLastName}
                  error={errors.lastName}
                />
                <CustomInput
                  label="Email Address"
                  placeholder="Enter your email address"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                  error={errors.email}
                />
                <CustomInput
                  label="Password"
                  placeholder="Enter your password"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  error={errors.password}
                />
                <CustomInput
                  label="Country"
                  placeholder="US"
                  value={'US'}
                  editable={false}
                />
                <CustomInput
                  label="State"
                  placeholder="Florida"
                  value={'Florida'}
                  editable={false}
                />
              </>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <View style={{ marginTop: 20 }}>
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
                  error={errors.zone}
                />
              </View>
            )}

            {/* Bottom Button */}
            {step === 1 && (
              <View style={styles.bottomButtonContainer}>
                <CustomButton title={'Next'} onPress={handleNextOrSubmit} />
              </View>
            )}
          </View>

          {/* Success Modal */}
          <SuccessModal
            visible={isSuccessModalVisible}
            onGoHome={() => {
              setSuccessModalVisible(false);
              navigation.replace('HomeTabs');
            }}
          />
        </ScrollView>
        {step === 2 && (
          <View style={styles.bottomButtonContainer}>
            <CustomButton
              title={'Create New Account'}
              onPress={handleNextOrSubmit}
            />
          </View>
        )}
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
    // flex: 1,
    // paddingBottom: 100,
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
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
  },
});
