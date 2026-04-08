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
import crashlytics, {
  crash,
  getCrashlytics,
} from '@react-native-firebase/crashlytics';
import { useSelector } from 'react-redux';

import CustomTile from '../../components/CustomTile';
import CustomText from '../../components/CustomText';
import CustomButton from '../../components/CustomButton';
import SettingsEditModal from '../../components/SettingsEditModal';
import { CloudCool, Droplet, Flag, PlantKBDI } from '../../assets';
import { bgColor, coolColor } from '../../constants/colors';
import { Setting, KBDISetting, ValueSetting } from '../../types';
import {
  getThermostats,
  setThermostats,
  Threshold,
} from '../../services/thermostatService';
import { RootState } from '../../redux/store';

type WindDirectionSetting = {
  icon: React.JSX.Element;
  title: string;
  rightValue: string;
  minValue: number | null;
  maxValue: number | null;
  key: string;
  type: string;
};

const SETTINGS_CONFIG = [
  {
    key: 'temperature',
    icon: CloudCool,
    title: 'Set Max Temperature',
    unit: ' °F',
    color: coolColor,
    defaultValue: 80,
    isKBDI: false,
    enabled: true,
    isRange: false,
  },
  {
    key: 'humidity',
    icon: Droplet,
    title: 'Set Min Rh',
    unit: ' %',
    defaultValue: 60,
    isKBDI: false,
    isRange: false,
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
    isRange: true,
  },
  {
    key: 'dispersion_index',
    icon: PlantKBDI,
    title: 'Set Dispersion Index',
    unit: '',
    defaultMinValue: 40,
    defaultMaxValue: 60,
    isDIndex: true,
    isRange: true,
    enabled: true,
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
  const [error, setError] = useState<
    | {
        errorMessage: string | null;
        thresholdData: string | null;
      }
    | undefined
  >();

  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);

  const initializeSettings = (): Setting[] =>
    SETTINGS_CONFIG.filter(c => c.enabled).map(config => {
      if (config.isRange) {
        return {
          icon:
            config.key == 'dispersion_index' ? (
              <View
                style={{
                  backgroundColor: '#B3D0D8',
                  padding: 5,
                  borderRadius: 100,
                }}
              >
                <PlantKBDI />
              </View>
            ) : (
              <config.icon />
            ),
          title: config.title,
          rightValue: `${config.defaultMinValue}-${config.defaultMaxValue}`,
          minValue: config.defaultMinValue,
          maxValue: config.defaultMaxValue,
          key: config.key,
          color: config.color,
        };
      }
      return {
        icon:
          config.key == 'dispersion_index' ? (
            <View
              style={{
                backgroundColor: '#B3D0D8',
                padding: 5,
                borderRadius: 100,
              }}
            >
              <PlantKBDI />
            </View>
          ) : (
            <config.icon />
          ),
        title: config.title,
        rightValue: `${config.defaultValue}${config.unit}`,
        value: config.defaultValue,
        key: config.key,
        color: config.color,
      };
    }) as Setting[];

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

  console.log('settings', settings);
  console.log('windDirections', windDirections);

  useEffect(() => {
    loadThresholdData();

    // crashlytics().log('Settings screen viewed iOS');
    // // Force a crash after a short delay (to ensure initialization completes)
    // setTimeout(() => {
    //   const crashlytics = getCrashlytics();
    //   crash(crashlytics); // This will kill the app
    //   console.log("App crashed for testing purposes");
    // }, 3000);
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
      console.log('Error loading threshold data:', error);
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
    // Map settings keys to their corresponding API field names
    const keyToApiField: Record<string, keyof Threshold> = {
      humidity: 'relativeHumidity',
    };

    setSettings(prev =>
      prev.map(item => {
        const apiField = keyToApiField[item.key] || (item.key as keyof Threshold);
        const apiValue = data[apiField];
        const config = SETTINGS_CONFIG.find(c => c.key === item.key);

        if (!config) return item;

        if (
          config.isRange &&
          typeof apiValue === 'object' &&
          apiValue !== null &&
          'min' in apiValue &&
          'max' in apiValue
        ) {
          const minVal = apiValue.min ?? config.defaultMinValue;
          const maxVal = apiValue.max ?? config.defaultMaxValue;
          // Remove 'value' property if present
          const { value, ...rest } = item as any;
          return {
            ...rest,
            minValue: minVal,
            maxValue: maxVal,
            rightValue: `${minVal}-${maxVal}`,
          };
        } else if (!config.isRange && typeof apiValue === 'number') {
          return {
            ...item,
            value: apiValue,
            rightValue: `${apiValue}${config.unit}`,
          };
        }

        return item;
      }),
    );

    if (data.wind_speed) {
      setWindDirections(prev =>
        prev.map(item => {
          const wind =
            data.wind_speed[item.key as keyof typeof data.wind_speed];
          if (wind) {
            const minVal = wind.min ?? 0;
            const maxVal = wind.max ?? 0;
            return {
              ...item,
              minValue: minVal,
              maxValue: maxVal,
              rightValue: `${minVal}-${maxVal} mph`,
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
      type: setting.minValue !== undefined ? 'range' : 'value',
    });
    setModalVisible(true);
  };

  // Modify handleValueChange to not validate immediately
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
            if (
              (config.isKBDI || config.isDIndex) &&
              typeof value === 'object'
            ) {
              return {
                ...item,
                minValue: value.min,
                maxValue: value.max,
                rightValue: `${value.min}-${value.max}`,
              } as KBDISetting;
            } else if (
              !config.isKBDI &&
              !config.isDIndex &&
              typeof value === 'number'
            ) {
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
                minValue: value.min == 0 ? null : value.min,
                maxValue: value.max == 0 ? null : value.max,
                rightValue:
                  value.min == 0 || value.max == 0
                    ? 'N/A'
                    : `${value.min}-${value.max} mph`,
              }
            : item,
        ),
      );
    }
  };

  // Add validation function
  const validateSettings = (): boolean => {
    // Validate main settings
    for (const setting of settings) {
      if ('value' in setting) {
        const value = setting.value;
        if (value !== null && value !== undefined) {
          if (value < 0) {
            Alert.alert(
              'Invalid Value',
              `${setting.title.replace('Set ', '')} cannot be negative`,
            );
            return false;
          }

          // Add specific validation for humidity
          if (setting.key === 'humidity') {
            if (value > 100) {
              Alert.alert('Invalid Value', 'Rh cannot be greater than 100%');
              return false;
            }
          }
        }
      }
      // ... existing KBDI and range validation ...
      if ('minValue' in setting && 'maxValue' in setting) {
        const minValue = setting.minValue;
        const maxValue = setting.maxValue;
        if (
          (minValue !== null && minValue !== undefined && minValue < 0) ||
          (maxValue !== null && maxValue !== undefined && maxValue < 0)
        ) {
          Alert.alert(
            'Invalid Value',
            `${setting.title.replace('Set ', '')} values cannot be negative`,
          );
          return false;
        }
        if (minValue != null && maxValue != null && minValue >= maxValue) {
          Alert.alert(
            'Invalid Range',
            `${setting.title.replace(
              'Set ',
              '',
            )} minimum value must be less than maximum value`,
          );
          return false;
        }
      }
    }

    // Validate wind directions
    for (const direction of windDirections) {
      if (direction.rightValue === 'N/A') {
        continue;
      }
      if (direction.minValue! < 0 || direction.maxValue! < 0) {
        Alert.alert(
          'Invalid Value',
          `${direction.title.replace('Set ', '')} values cannot be negative`,
        );
        return false;
      }
      if (
        direction.minValue! >= direction.maxValue! &&
        (direction.minValue !== 0 || direction.maxValue !== 0)
      ) {
        Alert.alert(
          'Invalid Range',
          `${direction.title.replace(
            'Set ',
            '',
          )} minimum value must be less than maximum value`,
        );
        return false;
      }
    }

    return true;
  };

  // Update handleSetThreshold to include validation
  const handleSetThreshold = async () => {
    if (!validateSettings()) {
      return;
    }

    try {
      setLoading(true);
      const thresholdData = collectCurrentThresholdData();
      console.log('Sending threshold data:', thresholdData);

      crashlytics().log('Setting threshold values');
      crashlytics().setUserId('test-user-01');
      crashlytics().setAttribute('screen', 'settings');
      crashlytics().setAttribute('userData', JSON.stringify(user));
      crashlytics().setAttribute(
        'thresholdData',
        JSON.stringify(thresholdData),
      );
      // setError(state => ({
      //   ...state,
      //   thresholdData: JSON.stringify(thresholdData, null, 2),
      // }));
      const response = await setThermostats(thresholdData as any);
      // crashlytics().crash();
      // setError();
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
      crashlytics().setAttribute('error', String(error));
      crashlytics().recordError(new Error(error as string), 'non-fatal');
      console.log('Error setting threshold:', error);
      // setError(state => ({
      //   ...state,
      //   errorMessage: String(error),
      // }));
      Alert.alert(
        'Error',
        'Failed to update threshold values. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const collectCurrentThresholdData = () => {
    const thresholdData: Partial<Threshold> = {};
    settings.forEach(setting => {
      if ('value' in setting) {
        // Only assign to keys that expect a number value
        if (setting.key === 'temperature') {
          (thresholdData as Threshold)[setting.key] = Number(setting.value);
        }
        if (setting.key === 'humidity') {
          (thresholdData as Threshold)['relativeHumidity'] = Number(
            setting.value,
          );
        }
      } else if ('minValue' in setting && 'maxValue' in setting) {
        // Only assign to keys that expect a min/max object
        if (setting.key === 'kbdi' || setting.key === 'dispersion_index') {
          (thresholdData as Threshold)[setting.key] = {
            min: Number(setting.minValue),
            max: Number(setting.maxValue),
          };
        }
      }
    });

    const wind_speed: any = {};
    windDirections.forEach(direction => {
      wind_speed[direction.key] = {
        min: Number(direction.minValue),
        max: Number(direction.maxValue),
      };
    });
    thresholdData.wind_speed = wind_speed;

    return thresholdData;
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
            icon={
              setting.key == 'dispersion_index' ? (
                <View
                  style={{
                    backgroundColor: '#B3D0D8',
                    padding: 5,
                    borderRadius: 100,
                  }}
                >
                  <PlantKBDI />
                </View>
              ) : (
                setting.icon
              )
            }
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
        {/* {error?.thresholdData && error?.errorMessage && (
          <CustomText
            size={14}
            color="red"
            style={{ marginVertical: 10, flexWrap: 'wrap' }}
          >
            {String(error.thresholdData)}
            {String(error.errorMessage)}
          </CustomText>
        )} */}
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
          <ActivityIndicator size="large" color={coolColor} />
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
    paddingVertical: 10,
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
