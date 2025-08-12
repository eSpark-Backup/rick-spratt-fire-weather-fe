import React, { useState, useEffect } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';

import CustomText from './CustomText';
import { ChevronUp, ChevronDown } from '../assets';
import { bgColor, coolColor } from '../constants/colors';
import { SettingsEditModalProps } from '../types';

export default function SettingsEditModal({
  visible,
  setting,
  onClose,
  onValueChange,
}: SettingsEditModalProps) {
  const [inputValue, setInputValue] = useState<string>('');
  const [minValue, setMinValue] = useState<string>('');
  const [maxValue, setMaxValue] = useState<string>('');

  useEffect(() => {
    if (setting) {
      if (setting.key === 'kbdi') {
        setMinValue(setting.minValue?.toString() || '0');
        setMaxValue(setting.maxValue?.toString() || '0');
      } else {
        setInputValue(setting.value.toString());
      }
    }
  }, [setting]);

  if (!setting) return null;

  const handleIncrement = (type?: 'min' | 'max') => {
    if (setting.key === 'kbdi') {
      if (type === 'min') {
        const newVal = (parseFloat(minValue) || 0) + 1;
        setMinValue(newVal.toString());
        onValueChange?.(setting.key, {
          min: newVal,
          max: parseFloat(maxValue) || 0,
        });
      } else {
        const newVal = (parseFloat(maxValue) || 0) + 1;
        setMaxValue(newVal.toString());
        onValueChange?.(setting.key, {
          min: parseFloat(minValue) || 0,
          max: newVal,
        });
      }
    } else {
      const newVal = (parseFloat(inputValue) || 0) + 1;
      setInputValue(newVal.toString());
      onValueChange?.(setting.key, newVal);
    }
  };

  const handleDecrement = (type?: 'min' | 'max') => {
    if (setting.key === 'kbdi') {
      if (type === 'min') {
        const newVal = (parseFloat(minValue) || 0) - 1;
        setMinValue(newVal.toString());
        onValueChange?.(setting.key, {
          min: newVal,
          max: parseFloat(maxValue) || 0,
        });
      } else {
        const newVal = (parseFloat(maxValue) || 0) - 1;
        setMaxValue(newVal.toString());
        onValueChange?.(setting.key, {
          min: parseFloat(minValue) || 0,
          max: newVal,
        });
      }
    } else {
      const newVal = (parseFloat(inputValue) || 0) - 1;
      setInputValue(newVal.toString());
      onValueChange?.(setting.key, newVal);
    }
  };

  const handleChange = (text: string, type?: 'min' | 'max') => {
    if (setting.key === 'kbdi') {
      if (type === 'min') {
        setMinValue(text);
        const parsed = parseFloat(text);
        if (!isNaN(parsed)) {
          onValueChange?.(setting.key, {
            min: parsed,
            max: parseFloat(maxValue) || 0,
          });
        }
      } else {
        setMaxValue(text);
        const parsed = parseFloat(text);
        if (!isNaN(parsed)) {
          onValueChange?.(setting.key, {
            min: parseFloat(minValue) || 0,
            max: parsed,
          });
        }
      }
    } else {
      setInputValue(text);
      const parsed = parseFloat(text);
      if (!isNaN(parsed)) {
        onValueChange?.(setting.key, parsed);
      }
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity style={styles.modalContent} activeOpacity={1}>
          <View style={styles.header}>
            {setting.icon}
            <CustomText
              style={styles.title}
              fontFamily="Gilroy-Medium"
              size={16}
            >
              {setting.title}
            </CustomText>
          </View>

          {setting.key === 'kbdi' ? (
            <>
              {/* Min */}
              <View style={styles.labeledRow}>
                <CustomText fontFamily="Gilroy-Medium" size={14}>
                  Min
                </CustomText>
                <View style={styles.row}>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      value={minValue}
                      onChangeText={t => handleChange(t, 'min')}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.arrowButtons}>
                    <TouchableOpacity
                      style={styles.arrowButton}
                      onPress={() => handleIncrement('min')}
                    >
                      <ChevronUp />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.arrowButton}
                      onPress={() => handleDecrement('min')}
                    >
                      <ChevronDown />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Max */}
              <View style={styles.labeledRow}>
                <CustomText fontFamily="Gilroy-Medium" size={14}>
                  Max
                </CustomText>
                <View style={styles.row}>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      value={maxValue}
                      onChangeText={t => handleChange(t, 'max')}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.arrowButtons}>
                    <TouchableOpacity
                      style={styles.arrowButton}
                      onPress={() => handleIncrement('max')}
                    >
                      <ChevronUp />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.arrowButton}
                      onPress={() => handleDecrement('max')}
                    >
                      <ChevronDown />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </>
          ) : (
            <View style={styles.row}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={inputValue}
                  onChangeText={handleChange}
                  placeholder="Enter value"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.arrowButtons}>
                <TouchableOpacity
                  style={styles.arrowButton}
                  onPress={() => handleIncrement()}
                >
                  <ChevronUp />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.arrowButton}
                  onPress={() => handleDecrement()}
                >
                  <ChevronDown />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </TouchableOpacity>
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
    width: '80%',
    backgroundColor: bgColor,
    borderRadius: 15,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    marginLeft: 12,
    color: '#333',
  },
  labeledRow: {
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: coolColor,
    marginRight: 5,
  },
  input: {
    flex: 1,
    height: 45,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
  },
  arrowButtons: {
    flexDirection: 'row',
    gap: 5,
  },
  arrowButton: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: coolColor,
    height: 45,
    width: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
