import React, { useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  findNodeHandle,
  UIManager,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import DropdownModal, { DropdownItem } from './DropdownModal';
import {
  ArrowDown,
  ArrowUp,
  BackIcon,
  BellIcon,
  LocationIcon,
} from '../assets';
import CustomText from './CustomText';
import { BottomTabNavigationProp } from '../navigation/navigation';
import { selectedCountry, selectedState } from '../constants';
import { labelColor } from '../constants/colors';

interface HeaderProps {
  username: string;
  locations: {
    label: string;
    value: string;
  }[];
  onLocationSelect: (location: string) => void;
  LeftIcon?: React.ReactNode;
  onLeftPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  username,
  locations,
  onLocationSelect,
  LeftIcon,
  onLeftPress,
}) => {
  const navigation = useNavigation<BottomTabNavigationProp>();
  const route = useRoute();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<DropdownItem>(
    locations[0],
  );
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  const locationRef = useRef<View>(null);

  // Calculate dropdown position relative to the header, below location CustomText
  const openDropdown = () => {
    if (locationRef.current) {
      const handle = findNodeHandle(locationRef.current);
      if (handle) {
        UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
          setDropdownPosition({
            top: pageY + height + 20,
            left: 10,
            width,
          });
          setModalVisible(true);
        });
      } else {
        // fallback if findNodeHandle returns null
        setModalVisible(true);
      }
    } else {
      setModalVisible(true);
    }
  };

  const handleSelectLocation = (item: DropdownItem) => {
    setSelectedLocation(item);
    onLocationSelect(item.value);
    setModalVisible(false);
  };

  // Prepare dropdown data from locations array
  const dropdownData: DropdownItem[] = locations.map(loc => ({
    label: loc.label,
    value: loc.value,
  }));

  const routeName = route.name;

  // Screens where you want the simple back header
  const simpleHeaderScreens = ['Notifications', 'Settings'];

  if (simpleHeaderScreens.includes(routeName)) {
    return (
      <View style={styles.simpleHeaderContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <BackIcon width={15} height={15} />
        </TouchableOpacity>
        <CustomText style={styles.titleText}>{routeName}</CustomText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.side}>
        {/* {LeftIcon ? (
          <TouchableOpacity onPress={navigation.goBack}>
            <BackIcon />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )} */}
      </View>

      <View style={styles.center}>
        <CustomText
          style={styles.greetingCustomText}
          color={labelColor}
          fontFamily="Gilroy-Regular"
        >
          Hi, {username}
        </CustomText>

        <TouchableOpacity
          style={styles.locationContainer}
          onPress={openDropdown}
          ref={locationRef}
          activeOpacity={0.7}
        >
          <LocationIcon />
          <CustomText style={styles.locationCustomText}>
            {selectedCountry}, {selectedState}, {selectedLocation.label}
          </CustomText>
          {modalVisible ? <ArrowUp /> : <ArrowDown />}
        </TouchableOpacity>
      </View>

      <View style={styles.side}>
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
          <BellIcon />
        </TouchableOpacity>
      </View>

      <DropdownModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        data={dropdownData}
        selectedValue={selectedLocation.value}
        onSelect={handleSelectLocation}
        position={dropdownPosition ?? undefined}
        maxHeight={400}
        width={'95%'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  simpleHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 28,
    backgroundColor: '#fff',
  },
  backButton: {
    paddingRight: 10,
  },
  titleText: {
    fontSize: 24,
  },
  side: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  placeholder: {
    width: 24,
    height: 24,
  },
  greetingCustomText: {
    fontSize: 16,
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationCustomText: {
    fontSize: 14,
    color: '#555',
  },
});

export default Header;
