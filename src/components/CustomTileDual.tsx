import { View, StyleSheet } from 'react-native';

import CustomText from './CustomText';
import ColoredTile from './ColoredTIle';
import { CustomTileProps } from '../types';

type ColoredTileProps = React.ComponentProps<typeof ColoredTile>;

interface DualTileProps
  extends Pick<ColoredTileProps, 'color' | 'activeOpacity' | 'onPress'> {
  topTile: Omit<CustomTileProps, 'style'>;
  bottomTile: Omit<CustomTileProps, 'style'>;
  color: string;
  activeOpacity?: number;
  onPress?: () => void;
}

const CustomTileDual: React.FC<DualTileProps> = ({
  topTile,
  bottomTile,
  color,
  activeOpacity,
  onPress,
}) => {
  return (
    <View style={styles.container}>
      <ColoredTile
        color={color!}
        activeOpacity={activeOpacity}
        onPress={onPress}
      >
        <View style={styles.tile}>
          <View style={styles.leftContainer}>
            {topTile.icon}
            <CustomText fontFamily="Gilroy-Medium" style={styles.title}>
              {topTile.title}
            </CustomText>
          </View>
          <CustomText style={styles.rightValue}>
            {topTile.rightValue}
          </CustomText>
        </View>
        <View style={styles.divider} />
        <View style={styles.tile}>
          <View style={styles.leftContainer}>
            {bottomTile.icon}
            <CustomText fontFamily="Gilroy-Medium" style={styles.title}>
              {bottomTile.title}
            </CustomText>
          </View>
          <CustomText style={styles.rightValue}>
            {bottomTile.rightValue}
          </CustomText>
        </View>
      </ColoredTile>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    backgroundColor: 'white',
    borderRadius: 11,
    overflow: 'hidden',
  },
  tile: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 16,
    marginLeft: 8,
  },
  rightValue: {
    fontSize: 16,
    color: '#555',
  },
});

export default CustomTileDual;
