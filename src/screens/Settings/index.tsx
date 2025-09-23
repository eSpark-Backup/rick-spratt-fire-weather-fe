import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  View,
  Dimensions,
} from 'react-native';
import CustomTile from '../../components/CustomTile';
import CustomText from '../../components/CustomText';
import CustomButton from '../../components/CustomButton';
import SettingsEditModal from '../../components/SettingsEditModal';
import {
  CloudCool,
  CloudHot,
  Droplet,
  Flag,
  PlantKBDI,
  Wind,
} from '../../assets';
import {
  bgColor,
  coolColor,
  primaryColor,
  tempColor,
} from '../../constants/colors';
import { Setting, KBDISetting, ValueSetting } from '../../types';
import {
  getThermostats,
  setThermostats,
  Threshold,
} from '../../services/thermostatService';

const SETTINGS_CONFIG = [
  {
    key: 'temperature',
    icon: CloudCool,
    title: 'Set Temperature',
    unit: ' °F',
    color: coolColor,
    defaultValue: 80,
    isKBDI: false,
    enabled: true,
  },
  {
    key: 'humidity',
    icon: Droplet,
    title: 'Set Rh',
    unit: ' %',
    defaultValue: 60,
    isKBDI: false,
    enabled: true,
  },
  {
    key: 'kbdi',
    icon: PlantKBDI,
    title: 'Set KBDI',
    unit: '',
    defaultMinValue: 150,
    defaultMaxValue: 500,
    isKBDI: true,
    enabled: false,
  },
];

const WIND_DIRECTIONS_CONFIG = [
  {
    key: 'N',
    type: 'range',
    direction: 'North',
    defaultMin: 0,
    defaultMax: 0,
  },
  {
    key: 'NE',
    type: 'range',
    direction: 'North-East',
    defaultMin: 0,
    defaultMax: 0,
  },
  {
    key: 'E',
    type: 'range',
    direction: 'East',
    defaultMin: 0,
    defaultMax: 0,
  },
  {
    key: 'SE',
    type: 'range',
    direction: 'South-East',
    defaultMin: 0,
    defaultMax: 0,
  },
  {
    key: 'S',
    type: 'range',
    direction: 'South',
    defaultMin: 0,
    defaultMax: 0,
  },
  {
    key: 'SW',
    type: 'range',
    direction: 'South-West',
    defaultMin: 0,
    defaultMax: 0,
  },
  {
    key: 'W',
    type: 'range',
    direction: 'West',
    defaultMin: 0,
    defaultMax: 0,
  },
  {
    key: 'NW',
    type: 'range',
    direction: 'North-West',
    defaultMin: 0,
    defaultMax: 0,
  },
];

const { width, height } = Dimensions.get('screen');

export default function SettingsScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  const initializeSettings = () => {
    return SETTINGS_CONFIG.filter(config => config.enabled).map(config => {
      if (config.isKBDI) {
        return {
          icon: <config.icon />,
          title: config.title,
          rightValue: `${config.defaultMinValue}-${config.defaultMaxValue}`,
          minValue: config.defaultMinValue,
          maxValue: config.defaultMaxValue,
          key: config.key,
          color: config.color,
        } as KBDISetting;
      } else {
        return {
          icon: <config.icon />,
          title: config.title,
          rightValue: `${config.defaultValue}${config.unit}`,
          value: config.defaultValue,
          key: config.key,
          color: config.color,
        } as ValueSetting;
      }
    });
  };

  type WindDirectionSetting = {
    icon: React.JSX.Element;
    title: string;
    rightValue: string;
    minValue: number;
    maxValue: number;
    key: string;
    type: string;
  };

  const initializeWindDirections = (): WindDirectionSetting[] => {
    return WIND_DIRECTIONS_CONFIG.map(config => ({
      icon: <Flag />,
      title: `Set ${config.direction} Wind`,
      rightValue: `${config.defaultMin}-${config.defaultMax} mph`,
      minValue: config.defaultMin,
      maxValue: config.defaultMax,
      key: config.key,
      type: config.type,
    }));
  };

  const [settings, setSettings] = useState<Setting[]>(initializeSettings());
  const [windDirections, setWindDirections] = useState<WindDirectionSetting[]>(
    initializeWindDirections(),
  );

  useEffect(() => {
    loadThresholdData();
  }, []);

  const loadThresholdData = async () => {
    try {
      setLoading(true);
      const response = await getThermostats();
      const data = response.data;

      if (data && typeof data === 'object') {
        updateSettingsFromAPI(data);
        setInitialDataLoaded(true);
      }
    } catch (error) {
      console.error('Error loading threshold data:', error);
      Alert.alert(
        'Error',
        'Failed to load threshold data. Using default values.',
      );
      setInitialDataLoaded(true);
    } finally {
      setLoading(false);
    }
  };

  const updateSettingsFromAPI = (data: Threshold) => {
    setSettings(prev =>
      prev.map(item => {
        const apiValue = data[item.key as keyof Threshold];
        if (apiValue !== undefined && apiValue !== null) {
          const config = SETTINGS_CONFIG.find(c => c.key === item.key);
          if (config) {
            if (config.isKBDI && 'minValue' in item && 'maxValue' in item) {
              return {
                ...item,
                rightValue: `${item.minValue}-${item.maxValue}`,
              } as KBDISetting;
            } else if (!config.isKBDI && 'value' in item) {
              const numericValue =
                typeof apiValue === 'string' ? parseFloat(apiValue) : apiValue;
              return {
                ...item,
                value: numericValue,
                rightValue: `${numericValue}${config.unit}`,
              } as ValueSetting;
            }
          }
        }
        return item;
      }),
    );

    if (data.wind_speed) {
      setWindDirections(prev =>
        prev.map(item => {
          const windApiValue =
            data.wind_speed[item.key as keyof typeof data.wind_speed];
          if (windApiValue) {
            return {
              ...item,
              minValue: windApiValue.min,
              maxValue: windApiValue.max,
              rightValue: `${windApiValue.min}-${windApiValue.max} mph`,
            };
          }
          return item;
        }),
      );
    }
  };

  const handleTilePress = (setting: any) => {
    setSelectedSetting({
      ...setting,
      value: setting.value,
      minValue: setting.minValue,
      maxValue: setting.maxValue,
      type:
        setting.type || (setting.minValue !== undefined ? 'range' : 'value'),
    });
    setModalVisible(true);
  };

  const handleValueChange = (
    key: string,
    value: number | { min: number; max: number },
  ) => {
    const config = SETTINGS_CONFIG.find(c => c.key === key);

    // Handle main settings (temp, humidity, KBDI)
    if (config && config.enabled) {
      setSettings(prev =>
        prev.map(item => {
          if (item.key === key) {
            if (config.isKBDI && typeof value === 'object') {
              return {
                ...item,
                minValue: value.min,
                maxValue: value.max,
                rightValue: `${value.min}-${value.max}`,
              } as KBDISetting;
            } else if (!config.isKBDI && typeof value === 'number') {
              return {
                ...item,
                value: value,
                rightValue: `${value}${config.unit}`,
              } as ValueSetting;
            }
          }
          return item;
        }),
      );
    }

    // Handle wind directions
    const windConfig = WIND_DIRECTIONS_CONFIG.find(c => c.key === key);
    if (windConfig && typeof value === 'object') {
      setWindDirections(prev =>
        prev.map(item =>
          item.key === key
            ? {
                ...item,
                minValue: value.min,
                maxValue: value.max,
                rightValue: `${value.min}-${value.max} mph`,
              }
            : item,
        ),
      );
    }
  };

  const collectCurrentThresholdData = (): Threshold => {
    const thresholdData: Threshold = {
      temperature: settings.find(s => s.key === 'temperature')?.value ?? 80,
      humidity: settings.find(s => s.key === 'humidity')?.value ?? 60,
      wind_speed: {
        N: { max: 0, min: 0 },
        NE: { max: 0, min: 0 },
        E: { max: 0, min: 0 },
        SE: { max: 0, min: 0 },
        S: { max: 0, min: 0 },
        SW: { max: 0, min: 0 },
        W: { max: 0, min: 0 },
        NW: { max: 0, min: 0 },
      },
    };

    windDirections.forEach(dir => {
      if (
        dir.minValue !== undefined &&
        dir.maxValue !== undefined &&
        dir.minValue !== 0 &&
        dir.maxValue !== 0
      ) {
        thresholdData.wind_speed[
          dir.key as keyof typeof thresholdData.wind_speed
        ] = {
          min: dir.minValue,
          max: dir.maxValue,
        };
      }
    });

    return thresholdData;
  };

  const handleSetThreshold = async () => {
    try {
      setLoading(true);

      const thresholdData = collectCurrentThresholdData();

      console.log('Sending threshold data:', thresholdData);

      const response = await setThermostats(thresholdData as any);

      Alert.alert(
        'Success',
        response.message || 'Threshold values updated successfully',
        [
          {
            text: 'OK',
            onPress: () => {
              loadThresholdData();
            },
          },
        ],
      );
    } catch (error) {
      console.error('Error setting threshold:', error);
      Alert.alert(
        'Error',
        'Failed to update threshold values. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  if (!initialDataLoaded) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.loadingContainer}>
          <CustomText size={16}>Loading settings...</CustomText>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {settings.map((setting, idx) => (
          <CustomTile
            key={`${setting.key}-${idx}`}
            icon={setting.icon}
            title={setting.title}
            rightValue={setting.rightValue}
            color={setting.color}
            onPress={() => handleTilePress(setting)}
          />
        ))}

        {windDirections.length > 0 && (
          <>
            <CustomText size={17} style={styles.windDirectionLabel}>
              Wind Direction
            </CustomText>

            {windDirections.map((direction, idx) => (
              <CustomTile
                key={`${direction.key}-${idx}`}
                icon={direction.icon}
                title={direction.title}
                rightValue={direction.rightValue}
                onPress={() => handleTilePress(direction)}
              />
            ))}
          </>
        )}

        <CustomButton
          title={loading ? 'Setting...' : 'Set Prescribed'}
          onPress={handleSetThreshold}
          disabled={loading}
        />
      </ScrollView>

      <SettingsEditModal
        visible={modalVisible}
        setting={selectedSetting}
        onClose={() => setModalVisible(false)}
        onValueChange={handleValueChange}
      />

      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <CustomText size={14} style={{ marginTop: 10 }}>
            Loading... Please wait
          </CustomText>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: bgColor,
  },
  scrollViewContent: {
    paddingHorizontal: 12,
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  windDirectionLabel: {
    paddingBottom: 10,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
});
