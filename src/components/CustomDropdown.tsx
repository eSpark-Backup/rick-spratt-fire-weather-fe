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
import DropdownModal, { DropdownItem } from './DropdownModal';
import { brdrColor } from '../constants/colors';

type Props = {
  data: DropdownItem[];
  placeholder?: string;
  onSelect: (item: DropdownItem) => void;
  selectedValue?: string;
  maxHeight?: number;
};

export default function CustomDropdown({
  data,
  placeholder = 'Select an option',
  onSelect,
  selectedValue,
  maxHeight,
}: Props) {
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
    <View>
      <TouchableOpacity
        ref={buttonRef}
        style={styles.dropdownButton}
        onPress={handleOpen}
      >
        <CustomText>
          {selectedItem ? selectedItem.label : placeholder}
        </CustomText>
        {isVisible ? <ArrowUp /> : <ArrowDown />}
      </TouchableOpacity>

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
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
});
