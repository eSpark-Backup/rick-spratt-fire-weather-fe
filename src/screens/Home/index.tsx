import React, { useCallback, useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { useSelector } from 'react-redux';

import { RootStackNavigationProp } from '../../navigation/navigation';
import CustomTile from '../../components/CustomTile';
import ColoredTile from '../../components/ColoredTIle';
import CustomText from '../../components/CustomText';
import {
  CloudHot,
  Droplet,
  Wind,
  PlantKBDI,
  Flag,
  CloudCool,
  WindHot,
  DropletHot,
  FlagRed,
} from '../../assets';
import {
  bgColor,
  coolColor,
  primaryColor,
  tempColor,
} from '../../constants/colors';
import {
  WeatherObservation,
  fetchWeatherObservations,
} from '../../services/weatherService';
import { RootState } from '../../redux/store';
import { Threshold, getThermostats } from '../../services/thermostatService';
import { isExceeding, isLessThan } from '../../utils/isexceeding';
import CustomTileDual from '../../components/CustomTileDual';

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
      console.log('[HomeScreen] Failed to fetch weather:', err);
    } finally {
      if (!isRefresh) setLoading(false);
    }
  };

  useEffect(() => {
    if (zoneId) {
      loadWeather();
    }
    console.log('🚀 ~ HomeScreen ~ zoneId:', zoneId);
  }, [zoneId]);

  const loadThresholds = async () => {
    try {
      const res = await getThermostats();
      setThreshold(res.data);
    } catch (err) {
      console.log('[HomeScreen] Failed to fetch thresholds:', err);
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

  const dir = latest?.windDirection;
  const dirThreshold = threshold?.wind_speed[dir!];

  const isThresholdSet =
    dirThreshold?.min !== null &&
    dirThreshold?.max !== null &&
    !(dirThreshold?.min === 0 && dirThreshold?.max === 0);

  const isOutOfRange =
    isThresholdSet &&
    latest &&
    dirThreshold &&
    (latest.windSpeed > dirThreshold.max ||
      latest.windSpeed < dirThreshold.min);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 12 }}
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
            color={primaryColor}
            style={{ marginBottom: '7%' }}
          />
        )}

        {latest && threshold && (
          <>
            <CustomTile
              icon={
                isExceeding(latest.temperature, threshold.temperature) ? (
                  <CloudHot />
                ) : (
                  <CloudCool />
                )
              }
              title="Temperature"
              rightValue={`${latest.temperature} °F`}
              color={
                isExceeding(latest.temperature, threshold.temperature)
                  ? tempColor
                  : coolColor
              }
              activeOpacity={1}
            />

            <CustomTile
              icon={
                isLessThan(latest.relativeHumidity, threshold.humidity) ? (
                  <DropletHot />
                ) : (
                  <Droplet />
                )
              }
              title="Rh"
              rightValue={`${latest?.relativeHumidity?.toFixed(0)} %`}
              color={
                isLessThan(latest.relativeHumidity, threshold.humidity)
                  ? tempColor
                  : coolColor
              }
              activeOpacity={1}
            />
            <CustomTileDual
              activeOpacity={1}
              color={isOutOfRange ? tempColor : coolColor}
              topTile={{
                icon: isOutOfRange ? <WindHot /> : <Wind />,
                title: 'Wind Speed',
                rightValue: `${latest?.windSpeed?.toFixed(1)} mph`,
              }}
              bottomTile={{
                icon: isOutOfRange ? <FlagRed /> : <Flag />,
                title: 'Wind Direction',
                rightValue: latest.windDirection,
              }}
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
