import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Alert } from 'react-native';
import CustomTile from '../../components/CustomTile';
import CustomText from '../../components/CustomText';
import CustomButton from '../../components/CustomButton';
import SettingsEditModal from '../../components/SettingsEditModal';
import { CloudHot, Droplet, Flag, PlantKBDI, Wind } from '../../assets';
import { bgColor, tempColor } from '../../constants/colors';
import { Setting, KBDISetting, ValueSetting } from '../../types';
import { getThermostats, setThermostats, Threshold } from '../../services/thermostatService'; // Adjust import path as needed

const SETTINGS_CONFIG = [
  {
    key: 'temperature',
    icon: CloudHot,
    title: 'Set Temperature',
    unit: '°C',
    color: tempColor,
    defaultValue: 80,
    isKBDI: false,
    enabled: true,
  },
  {
    key: 'humidity',
    icon: Droplet,
    title: 'Set Humidity',
    unit: '%',
    defaultValue: 60,
    isKBDI: false,
    enabled: true,
  },
  {
    key: 'windSpeed',
    icon: Wind,
    title: 'Set Wind Speed',
    unit: ' mph',
    defaultValue: 15,
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
  { key: 'southDir', direction: 'South', defaultValue: 75 },
  { key: 'northDir', direction: 'North', defaultValue: 75 },
  { key: 'westDir', direction: 'West', defaultValue: 75 },
  { key: 'eastDir', direction: 'East', defaultValue: 75 },
];

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

  const initializeWindDirections = () => {
    return WIND_DIRECTIONS_CONFIG.map(config => ({
      icon: <Flag />,
      title: `Set ${config.direction} Direction`,
      rightValue: `Above ${config.defaultValue}`,
      value: config.defaultValue,
      key: config.key,
    }));
  };

  const [settings, setSettings] = useState<Setting[]>(initializeSettings());
  const [windDirections, setWindDirections] = useState(initializeWindDirections());

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
      Alert.alert('Error', 'Failed to load threshold data. Using default values.');
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
              return {
                ...item,
                value: apiValue,
                rightValue: `${apiValue}${config.unit}`,
              } as ValueSetting;
            }
          }
        }
        return item;
      }),
    );

    setWindDirections(prev =>
      prev.map(item => {
        const apiValue = data[item.key as keyof Threshold];
        if (apiValue !== undefined && apiValue !== null) {
          return {
            ...item,
            value: apiValue,
            rightValue: `Above ${apiValue}`,
          };
        }
        return item;
      }),
    );
  };

  const handleTilePress = (setting: any) => {
    setSelectedSetting({
      ...setting,
      value: setting.value,
      minValue: setting.minValue,
      maxValue: setting.maxValue,
    });
    setModalVisible(true);
  };

  const handleValueChange = (
    key: string,
    value: number | { min: number; max: number },
  ) => {
    const config = SETTINGS_CONFIG.find(c => c.key === key);
    
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
                value: undefined,
              } as KBDISetting;
            } else if (!config.isKBDI && typeof value === 'number') {
              return {
                ...item,
                value: value,
                rightValue: `${value}${config.unit}`,
                minValue: undefined,
                maxValue: undefined,
              } as ValueSetting;
            }
          }
          return item;
        }),
      );
    }

    const windConfig = WIND_DIRECTIONS_CONFIG.find(c => c.key === key);
    if (windConfig && typeof value === 'number') {
      setWindDirections(prev =>
        prev.map(item =>
          item.key === key
            ? {
                ...item,
                value: value,
                rightValue: `Above ${value}`,
              }
            : item,
        ),
      );
    }
  };

  const collectCurrentThresholdData = (): Threshold => {
    const thresholdData: Partial<Threshold> = {};

    settings.forEach(setting => {
      if ('value' in setting && setting.value !== undefined) {
        (thresholdData as any)[setting.key] = setting.value;
      } else if ('minValue' in setting && 'maxValue' in setting && 
                 setting.minValue !== undefined && setting.maxValue !== undefined) {
        (thresholdData as any)[setting.key] = {
          min: setting.minValue,
          max: setting.maxValue,
        };
      }
    });

    windDirections.forEach(direction => {
      if (direction.value !== undefined) {
        (thresholdData as any)[direction.key] = direction.value;
      }
    });

    const completeThresholdData: Threshold = {
      temperature: thresholdData.temperature ?? 80,
      humidity: thresholdData.humidity ?? 60,
      windSpeed: thresholdData.windSpeed ?? 15,
      southDir: thresholdData.southDir ?? 75,
      northDir: thresholdData.northDir ?? 75,
      eastDir: thresholdData.eastDir ?? 75,
      westDir: thresholdData.westDir ?? 75,
    };

    return completeThresholdData;
  };

  const handleSetThreshold = async () => {
    try {
      setLoading(true);
      
      const thresholdData = collectCurrentThresholdData();
      
      console.log('Sending threshold data:', thresholdData);
      
      const response = await setThermostats(thresholdData);
      
      Alert.alert(
        'Success', 
        response.message || 'Threshold values updated successfully',
        [
          {
            text: 'OK',
            onPress: () => {
              loadThresholdData();
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error setting threshold:', error);
      Alert.alert(
        'Error', 
        'Failed to update threshold values. Please try again.'
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
          title={loading ? "Setting..." : "Set Prescribed"} 
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
});