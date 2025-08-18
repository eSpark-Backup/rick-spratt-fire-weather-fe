import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { RootStackNavigationProp } from '../../navigation/navigation';
import CustomTile from '../../components/CustomTile';
import ColoredTile from '../../components/ColoredTIle';
import CustomText from '../../components/CustomText';
import { CloudHot, Droplet, Wind, PlantKBDI, Flag } from '../../assets';
import { bgColor, tempColor } from '../../constants/colors';

type Props = { navigation: RootStackNavigationProp<'HomeTabs'> };

const TILES = [
  {
    icon: <CloudHot />,
    title: 'Temperature',
    rightValue: '80°C',
    color: tempColor,
  },
  {
    icon: <Droplet />,
    title: 'Humidity',
    rightValue: '60%',
  },
  {
    icon: <Wind />,
    title: 'Wind Speed',
    rightValue: '15 mph',
  },
  {
    icon: <PlantKBDI />,
    title: 'KBDI',
    rightValue: '150-500',
  },
  {
    icon: <Flag />,
    title: 'Wind Direction',
    rightValue: 'Above 75',
  },
];

const COMMENT = 'Prescribed Conditions';

export default function HomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      {TILES.map((tile, idx) => (
        <CustomTile
          key={tile.title}
          icon={tile.icon}
          title={tile.title}
          rightValue={tile.rightValue}
          color={tile.color}
          activeOpacity={1}
        />
      ))}
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
