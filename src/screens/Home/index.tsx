import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, ActivityIndicator } from 'react-native';
import { RootStackNavigationProp } from '../../navigation/navigation';
import CustomTile from '../../components/CustomTile';
import ColoredTile from '../../components/ColoredTIle';
import CustomText from '../../components/CustomText';
import { CloudHot, Droplet, Wind, PlantKBDI, Flag } from '../../assets';
import { bgColor, tempColor } from '../../constants/colors';
import {
  WeatherObservation,
  fetchWeatherObservations,
} from '../../services/weatherService';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

type Props = { navigation: RootStackNavigationProp<'HomeTabs'> };

const COMMENT = 'Prescribed Conditions';

export default function HomeScreen({ navigation }: Props) {
  const [observations, setObservations] = useState<WeatherObservation[]>([]);
  const [loading, setLoading] = useState(false);
  const zoneId = useSelector((state: RootState) => state.auth.user?.zoneId);

  const loadWeather = async () => {
    if (!zoneId) {
      console.warn('[HomeScreen] No zoneId available in Redux');
      return;
    }

    setLoading(true);
    try {
      console.log('[HomeScreen] Fetching weather for zoneId:', zoneId);
      const data = await fetchWeatherObservations(zoneId);
      console.log('[HomeScreen] Weather response:', data);
      setObservations(data);
    } catch (err) {
      console.error('[HomeScreen] Failed to fetch weather:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (zoneId) {
      loadWeather();
    }
  }, [zoneId]);

  // Get the most recent observation
  const latest = observations.length > 0 ? observations[0] : null;

  return (
    <SafeAreaView style={styles.container}>
      {loading && (
        <ActivityIndicator
          size="large"
          color={tempColor}
          style={{ marginBottom: '7%' }}
        />
      )}

      {latest && (
        <>
          <CustomTile
            icon={<CloudHot />}
            title="Temperature"
            rightValue={`${latest.temperature}°C`}
            color={tempColor}
            activeOpacity={1}
          />
          <CustomTile
            icon={<Droplet />}
            title="Humidity"
            rightValue={`${latest.Humidity?.toFixed(0)}%`}
            activeOpacity={1}
          />
          <CustomTile
            icon={<Wind />}
            title="Wind Speed"
            rightValue={`${latest.windSpeed?.toFixed(1)} mph`}
            activeOpacity={1}
          />
          <CustomTile
            icon={<PlantKBDI />}
            title="KBDI"
            rightValue="150-500" // <-- If backend gives this later, replace static
            activeOpacity={1}
          />
          <CustomTile
            icon={<Flag />}
            title="Wind Direction"
            rightValue={`${latest.windDirection}°`}
            activeOpacity={1}
          />
        </>
      )}

      {!loading && !latest && (
        <CustomText>No weather data available.</CustomText>
      )}

      <ColoredTile color="#FAFAFA" style={styles.commentTile} activeOpacity={1}>
        <CustomText style={styles.commentText}>{COMMENT}</CustomText>
      </ColoredTile>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: bgColor,
  },
  commentTile: {
    borderWidth: 1,
    borderColor: '#CFC5C5',
    paddingVertical: 19,
  },
  commentText: {
    textAlign: 'center',
  },
});
