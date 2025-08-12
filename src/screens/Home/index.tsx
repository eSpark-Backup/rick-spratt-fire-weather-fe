import React from 'react';
import { View, Text, Button } from 'react-native';
import { RootStackNavigationProp } from '../../navigation/navigation';

type Props = { navigation: RootStackNavigationProp<'HomeTabs'> };

export default function HomeScreen({ navigation }: Props) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home Screen</Text>
    </View>
  );
}
