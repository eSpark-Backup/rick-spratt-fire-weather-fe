import { View, Text, StyleSheet } from 'react-native';
import CustomText from './CustomText';
import ColoredTile from './ColoredTIle';

interface CustomTileProps {
  icon: React.ReactNode;
  title: string;
  rightValue: string;
  color?: string;
  activeOpacity?: number;
  onPress?: () => void;
}

const CustomTile: React.FC<CustomTileProps> = ({
  icon,
  title,
  rightValue,
  color,
  activeOpacity,
  onPress,
}) => {
  return (
    <ColoredTile
      color={color!}
      style={styles.container}
      activeOpacity={activeOpacity}
      onPress={onPress}
    >
      <View style={styles.leftContainer}>
        {icon}
        <CustomText fontFamily="Gilroy-Medium" style={styles.title}>
          {title}
        </CustomText>
      </View>
      <CustomText style={styles.rightValue}>{rightValue}</CustomText>
    </ColoredTile>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 11,
    // backgroundColor: '#fff',
    marginBottom: 12,
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

export default CustomTile;
