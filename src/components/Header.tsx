import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  findNodeHandle,
  UIManager,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import DropdownModal from './DropdownModal';
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
import { DropdownItem, HeaderProps } from '../types';

import { Zone, fetchZones, updateZone } from '../services/zoneService';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useDispatch } from 'react-redux';
import { updateUserZone } from '../redux/slices/authSlice';

const Header: React.FC<HeaderProps> = ({
  username,
  locations,
  onLocationSelect,
  LeftIcon,
  onLeftPress,
}) => {
  const navigation = useNavigation<BottomTabNavigationProp>();
  const route = useRoute();
  const user = useSelector((state: RootState) => state.auth.user);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<DropdownItem>({
    label: user?.zoneName || user?.zoneId,
    value: user?.zoneId,
  });
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);
  const [zones, setZones] = useState<Zone[]>([]);
  const [loadingZones, setLoadingZones] = useState(false);
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadZones = async (pageToLoad: number = 1) => {
    if (loadingZones || !hasMore) return;
    setLoadingZones(true);

    try {
      const fetchedZones = await fetchZones('FL', 'fire', pageToLoad, 30);

      if (fetchedZones.length === 0) {
        setHasMore(false);
      } else {
        setZones(prev => {
          const merged = [...prev, ...fetchedZones];
          return merged.filter(
            (zone, index, self) =>
              index === self.findIndex(z => z.id === zone.id),
          );
        });
        setPage(pageToLoad);
        if (fetchedZones.length < 30) setHasMore(false); // 👈 stop further calls
      }
    } catch (error) {
      console.error('Error fetching zones:', error);
    } finally {
      setLoadingZones(false);
    }
  };

  useEffect(() => {
    loadZones(1); // first load
  }, []);

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

  const handleSelectLocation = async (item: DropdownItem) => {
    setSelectedLocation(item);
    onLocationSelect(item.value);
    setModalVisible(false);

    try {
      const res = await updateZone(item.value); // API call
      console.log('Zone updated:', res);

      // ✅ update Redux store
      dispatch(updateUserZone(item.value));
    } catch (err) {
      console.error('Error updating zone:', err);
    }
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
          Hi, {user?.firstName}
        </CustomText>

        <TouchableOpacity
          style={styles.locationContainer}
          onPress={openDropdown}
          ref={locationRef}
          activeOpacity={0.7}
        >
          <LocationIcon />
          <CustomText style={styles.locationCustomText}>
            {user?.country}, {user?.state}, {selectedLocation.label}
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
        data={zones.map(z => ({ label: z.name, value: z.id }))}
        selectedValue={selectedLocation.value}
        onSelect={handleSelectLocation}
        position={dropdownPosition ?? undefined}
        maxHeight={400}
        width={'95%'}
        onEndReached={() => loadZones(page + 1)} // 👈 load next page
        loading={loadingZones}
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
