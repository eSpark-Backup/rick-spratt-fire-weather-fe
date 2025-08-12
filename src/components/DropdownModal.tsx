import React from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';
import CustomText from './CustomText';
import { CheckIcon } from '../assets';

export type DropdownItem = {
  label: string;
  value: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  data: DropdownItem[];
  selectedValue?: string;
  onSelect: (item: DropdownItem) => void;
  position?: { top: number; left: number; width: number };
  maxHeight?: number;
};

export default function DropdownModal({
  visible,
  onClose,
  data,
  selectedValue,
  onSelect,
  position,
  maxHeight = 400,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={StyleSheet.absoluteFill}>
        {/* Close on background tap */}
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPressOut={onClose}
        />

        {position && (
          <View
            style={[
              styles.dropdownContainer,
              {
                position: 'absolute',
                top: position.top,
                left: position.left,
                width: position.width,
              },
            ]}
          >
            <FlatList
              data={data}
              keyExtractor={item => item.value}
              style={{ maxHeight }}
              renderItem={({ item }) => {
                const isSelected = item.value === selectedValue;
                return (
                  <TouchableOpacity
                    style={styles.itemContainer}
                    onPress={() => {
                      onSelect(item);
                      onClose();
                    }}
                  >
                    {isSelected ? (
                      <CheckIcon />
                    ) : (
                      <View style={{ width: 16, height: 16 }} />
                    )}
                    <CustomText>{item.label}</CustomText>
                  </TouchableOpacity>
                );
              }}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  dropdownContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 8,
    elevation: 5,
  },
  itemContainer: {
    paddingHorizontal: 12,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});
