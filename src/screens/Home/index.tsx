import React, { useCallback, useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from 'react-native';
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
import { Threshold, getThermostats } from '../../services/thermostatService';
import { isExceeding } from '../../utils/isexceeding';

type Props = { navigation: RootStackNavigationProp<'HomeTabs'> };

const COMMENT = 'Prescribed Conditions';

export default function HomeScreen({ navigation }: Props) {
  const [observations, setObservations] = useState<WeatherObservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [threshold, setThreshold] = useState<Threshold | null>(null);

  const zoneId = useSelector((state: RootState) => state.auth.user?.zoneId);

  const loadWeather = async (isRefresh = false) => {
    if (!zoneId) {
      console.warn('[HomeScreen] No zoneId available in Redux');
      return;
    }

    if (!isRefresh) setLoading(true);
    try {
      console.log('[HomeScreen] Fetching weather for zoneId:', zoneId);
      const data = await fetchWeatherObservations(zoneId);
      console.log('[HomeScreen] Weather response:', data);
      setObservations(data);
    } catch (err) {
      console.error('[HomeScreen] Failed to fetch weather:', err);
    } finally {
      if (!isRefresh) setLoading(false);
    }
  };

  useEffect(() => {
    if (zoneId) {
      loadWeather();
    }
  }, [zoneId]);

  const loadThresholds = async () => {
    try {
      const res = await getThermostats();
      setThreshold(res.data);
    } catch (err) {
      console.error('[HomeScreen] Failed to fetch thresholds:', err);
    }
  };

  useEffect(() => {
    loadThresholds();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    loadThresholds();
    await loadWeather(true); // ✅ pass true so it won't trigger `loading`
    setRefreshing(false);
  }, [zoneId]);

  // Get the most recent observation
  const latest = observations.length > 0 ? observations[0] : null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={tempColor}
          />
        }
      >
        {loading && (
          <ActivityIndicator
            size="large"
            color={tempColor}
            style={{ marginBottom: '7%' }}
          />
        )}

        {latest && threshold && (
          <>
            <CustomTile
              icon={<CloudHot />}
              title="Temperature"
              rightValue={`${latest.temperature}°C`}
              color={
                isExceeding(latest.temperature, threshold.temperature)
                  ? tempColor
                  : undefined
              }
              activeOpacity={1}
            />

            <CustomTile
              icon={<Droplet />}
              title="Humidity"
              rightValue={`${latest.Humidity?.toFixed(0)}%`}
              color={
                isExceeding(latest.Humidity, threshold.humidity)
                  ? tempColor
                  : undefined
              }
              activeOpacity={1}
            />

            <CustomTile
              icon={<Wind />}
              title="Wind Speed"
              rightValue={`${latest.windSpeed?.toFixed(1)} mph`}
              color={
                isExceeding(latest.windSpeed, threshold.windSpeed)
                  ? tempColor
                  : undefined
              }
              activeOpacity={1}
            />

            <CustomTile
              icon={<Flag />}
              title="Wind Direction"
              rightValue={`${latest.windDirection}°`}
              color={
                isExceeding(latest.windDirection, threshold.northDir) ||
                isExceeding(latest.windDirection, threshold.southDir) ||
                isExceeding(latest.windDirection, threshold.eastDir) ||
                isExceeding(latest.windDirection, threshold.westDir)
                  ? tempColor
                  : undefined
              }
              activeOpacity={1}
            />
          </>
        )}

        {!loading && !latest && (
          <CustomText>No weather data available.</CustomText>
        )}

        <ColoredTile
          color="#FAFAFA"
          style={styles.commentTile}
          activeOpacity={1}
        >
          <CustomText style={styles.commentText}>{COMMENT}</CustomText>
        </ColoredTile>
      </ScrollView>
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
