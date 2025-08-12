import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import CustomTile from '../../components/CustomTile';
import CustomText from '../../components/CustomText';
import CustomButton from '../../components/CustomButton';
import SettingsEditModal from '../../components/SettingsEditModal';
import { CloudHot, Droplet, Flag, PlantKBDI, Wind } from '../../assets';
import { bgColor, tempColor } from '../../constants/colors';

const WIND_DIRECTIONS = ['South', 'North', 'West', 'East'];

export default function SettingsScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState(null);

  const [settings, setSettings] = useState([
    {
      icon: <CloudHot />,
      title: 'Set Temperature',
      rightValue: '80°C',
      value: 80,
      color: tempColor,
      key: 'temperature',
    },
    {
      icon: <Droplet />,
      title: 'Set Humidity',
      rightValue: '60%',
      value: 60,
      key: 'humidity',
    },
    {
      icon: <Wind />,
      title: 'Set Wind Speed',
      rightValue: '15 mph',
      value: 15,
      key: 'windSpeed',
    },
    {
      icon: <PlantKBDI />,
      title: 'Set KBDI',
      rightValue: '150-500',
      minValue: 150,
      maxValue: 500,
      key: 'kbdi',
    },
  ]);

  const [windDirections, setWindDirections] = useState(
    WIND_DIRECTIONS.map(dir => ({
      icon: <Flag />,
      title: `Set ${dir} Direction`,
      rightValue: 'Above 75',
      value: 75,
      key: `wind_${dir.toLowerCase()}`,
    })),
  );

  const handleTilePress = (setting: any) => {
    setSelectedSetting({
      ...setting,
      value: setting.value,
      minValue: setting.minValue,
      maxValue: setting.maxValue,
    });
    setModalVisible(true);
  };

  const handleSetThreshold = () => {};

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {settings.map((setting, idx) => (
          <CustomTile
            key={setting.title}
            icon={setting.icon}
            title={setting.title}
            rightValue={setting.rightValue}
            color={setting.color}
            onPress={() => handleTilePress(setting)}
          />
        ))}

        <CustomText size={17} style={styles.windDirectionLabel}>
          Wind Direction
        </CustomText>

        {windDirections.map(direction => (
          <CustomTile
            key={direction.key}
            icon={direction.icon}
            title={direction.title}
            rightValue={direction.rightValue}
            onPress={() => handleTilePress(direction)}
          />
        ))}

        <CustomButton title="Set Thresholds" onPress={() => {}} />
      </ScrollView>

      <SettingsEditModal
        visible={modalVisible}
        setting={selectedSetting}
        onClose={() => setModalVisible(false)}
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
  windDirectionLabel: {
    paddingBottom: 10,
  },
});
