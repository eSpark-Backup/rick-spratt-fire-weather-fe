import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import { fetchZones, Zone } from '../../services/zoneService';
import CustomText from '../../components/CustomText';
import {
  bgColor,
  brdrColor,
  labelColor,
  primaryColor,
} from '../../constants/colors';
import { updateUserZone } from '../../redux/slices/authSlice';

// Update the params type to handle both cases
type ZoneSelectionParams = {
  ZoneSelection: {
    onSelect?: (zone: Zone) => void;
    fromScreen?: 'Home' | 'SignUp';
  };
};

export default function ZoneSelection() {
  const [zones, setZones] = useState<Zone[]>([]);
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ZoneSelectionParams, 'ZoneSelection'>>();
  const onSelect = route.params?.onSelect;
  const fromScreen = route.params?.fromScreen;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredZones, setFilteredZones] = useState<Zone[]>([]);

  const loadZones = async () => {
    setLoading(true);
    try {
      const fetchedZones = await fetchZones('FL', 'fire', 1, 200);
      setZones(fetchedZones);
      setFilteredZones(fetchedZones);
    } catch (error) {
      console.log('Error fetching zones:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadZones();
  }, []);

  useEffect(() => {
    const filtered = zones.filter(zone =>
      zone.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredZones(filtered);
  }, [searchQuery, zones]);

  const handleSelectZone = (zone: Zone) => {
    if (fromScreen === 'Home') {
      // Update Redux store for Home screen
      dispatch(
        updateUserZone({
          zoneId: zone.id,
          zoneName: zone.name,
        }),
      );
      navigation.goBack();
    } else if (onSelect) {
      // Handle SignUp flow
      onSelect(zone);
    }
  };

  const renderItem = ({ item }: { item: Zone }) => (
    <TouchableOpacity
      style={styles.zoneItem}
      onPress={() => handleSelectZone(item)}
    >
      <CustomText style={styles.zoneName}>{item.name}</CustomText>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading && zones.length === 0 ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={primaryColor} />
        </View>
      ) : (
        <>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search zones..."
              value={searchQuery}
              placeholderTextColor={labelColor}
              onChangeText={setSearchQuery}
            />
          </View>

          <FlatList
            data={filteredZones}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: bgColor,
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: brdrColor,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: brdrColor,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
  },
  zoneItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: brdrColor,
  },
  zoneName: {
    fontSize: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
