import { StyleSheet, TouchableOpacity } from 'react-native';
import { coolColor } from '../constants/colors';
import { ColoredTileProps } from '../types';

const ColoredTile: React.FC<ColoredTileProps> = ({
  color = coolColor,
  children,
  style,
  activeOpacity = 0.7,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.tile, { backgroundColor: color }, style]}
      activeOpacity={activeOpacity}
      onPress={onPress}
    >
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tile: {
    padding: 12,
    borderRadius: 11,
    marginBottom: 12,
  },
});

export default ColoredTile;
