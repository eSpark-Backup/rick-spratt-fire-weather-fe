import React, { useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  LayoutRectangle,
  findNodeHandle,
  UIManager,
} from 'react-native';

import CustomText from './CustomText';
import { ArrowDown, ArrowUp } from '../assets';
import DropdownModal from './DropdownModal';
import { brdrColor } from '../constants/colors';
import { DropdownProps } from '../types';

export default function CustomDropdown({
  data,
  placeholder = 'Select an option',
  onSelect,
  selectedValue,
  maxHeight,
  error, // <-- new prop
  hasError = false,
  onEndReached,
  loading = false,
}: DropdownProps & { onEndReached?: () => void; loading?: boolean }) {
  const [isVisible, setIsVisible] = useState(false);
  const [buttonLayout, setButtonLayout] = useState<LayoutRectangle | null>(
    null,
  );
  const buttonRef = useRef(null);

  const handleOpen = () => {
    if (buttonRef.current) {
      const handle = findNodeHandle(buttonRef.current);
      if (handle) {
        UIManager.measure(handle, (_x, _y, width, height, pageX, pageY) => {
          setButtonLayout({ x: pageX, y: pageY, width, height });
          setIsVisible(true);
        });
      }
    }
  };

  const selectedItem = data.find(item => item.value === selectedValue);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        ref={buttonRef}
        style={[styles.dropdownButton, hasError && styles.dropdownError]}
        onPress={handleOpen}
      >
        <CustomText color={hasError ? '#E74C3C' : undefined}>
          {selectedItem ? selectedItem.label : placeholder}
        </CustomText>
        {isVisible ? <ArrowUp /> : <ArrowDown />}
      </TouchableOpacity>

      {error && (
        <CustomText style={styles.errorText} size={12}>
          {error}
        </CustomText>
      )}

      <DropdownModal
        visible={isVisible}
        onClose={() => setIsVisible(false)}
        data={data}
        selectedValue={selectedValue}
        onSelect={onSelect}
        maxHeight={maxHeight}
        position={
          buttonLayout
            ? {
                top: buttonLayout.y + buttonLayout.height + 10,
                left: buttonLayout.x,
                width: buttonLayout.width,
              }
            : undefined
        }
        onEndReached={onEndReached} // 👈 load next page
        loading={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  dropdownButton: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: brdrColor,
    height: 57,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dropdownError: {
    borderColor: '#E74C3C',
    backgroundColor: '#FFF5F5',
  },
  errorText: {
    color: '#E74C3C',
    marginTop: 4,
    marginRight: 2,
  },
});
