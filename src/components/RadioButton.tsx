import React, { useState } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';

interface RadioButtonProps {
  selected?: boolean;
  onPress: () => void;
}

const RadioButton: React.FC<RadioButtonProps> = ({ selected, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.outerCircle}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {selected && <View style={styles.innerCircle} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0', // blue border
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#007BFF', // blue fill
  },
});

export default RadioButton;
