import { View, StyleSheet } from 'react-native';

import CustomText from './CustomText';
import ColoredTile from './ColoredTIle';
import { timeColor } from '../constants/colors';
import { NotificationTileProps } from '../types';

const NotificationTile: React.FC<NotificationTileProps> = ({
  icon,
  message,
  time,
  color,
  onPress,
}) => {
  return (
    <ColoredTile onPress={onPress} color={color!} style={styles.container}>
      <View style={styles.leftContainer}>
        {icon}
        <View style={styles.title}>
          <CustomText fontFamily="Gilroy-Medium" size={12} color={timeColor}>
            {time}
          </CustomText>
          <CustomText fontFamily="Gilroy-Medium" size={14}>
            {message}
          </CustomText>
        </View>
      </View>
      {/* <ChevronRight width={16} height={16} /> */}
    </ColoredTile>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingRight: 22,
    borderRadius: 11,
    marginBottom: 12,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    marginLeft: 10,
    gap: 5,
    width: '80%',
  },
});

export default NotificationTile;
