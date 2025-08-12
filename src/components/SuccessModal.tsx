import React from 'react';
import { View, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import CustomText from './CustomText';
import CustomButton from './CustomButton';
import { BlueCirleTick } from '../assets';
import { bgColor } from '../constants/colors';

type Props = {
  visible: boolean;
  onGoHome: () => void;
};

export default function SuccessModal({ visible, onGoHome }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity style={styles.overlay} activeOpacity={1}>
        <View style={styles.modalContent}>
          <BlueCirleTick style={{ alignSelf: 'center' }} />
          <CustomText style={styles.message} fontFamily="Gilroy-Bold" size={28}>
            You have logged in successfully
          </CustomText>
          <CustomText style={styles.subMessage}>
            You may now continue using your account
          </CustomText>
          <CustomButton
            title="Go to Home"
            onPress={onGoHome}
            textStyle={{ fontSize: 17 }}
            style={{ width: '95%', alignSelf: 'center' }}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: bgColor,
    borderRadius: 20,
    padding: 20,
    paddingVertical: '15%',
  },
  message: {
    textAlign: 'center',
    marginVertical: 20,
    lineHeight: 35,
  },
  subMessage: {
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 30,
  },
});
