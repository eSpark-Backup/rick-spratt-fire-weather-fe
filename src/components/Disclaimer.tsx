import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  Modal,
} from 'react-native';

import {
  bgColor,
  brdrColor,
  primaryColor,
  textColor,
} from '../constants/colors';

const { height } = Dimensions.get('window');

const Disclaimer = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Disclaimer</Text>
          </View>
          <View style={styles.contentContainer}>
            <Text style={styles.paragraph}>
              RX Fire Alert is not a certified weather product and should not be
              used as the sole source for prescribed fire decisions. Always
              follow local, state, and federal regulations.
            </Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: bgColor,
    borderRadius: 20,
    width: '90%',
    maxHeight: height * 0.8,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: brdrColor,
  },
  headerTitle: {
    fontSize: 20,
    color: '#000',
    fontFamily: 'Gilroy-Bold',
  },
  closeButton: {
    borderColor: brdrColor,
    borderWidth: 2,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 12,
    padding: 10,
    paddingHorizontal: 15,
  },
  closeText: {
    fontSize: 16,
    color: primaryColor, // iOS blue
    fontFamily: 'Gilroy-Bold',
  },
  contentContainer: {
    padding: 20,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 10,
    color: textColor,
    lineHeight: 24,
    fontFamily: 'Gilroy-Regular',
  },
});

export default Disclaimer;
