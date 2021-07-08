import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {StyleSheet} from 'react-native';
import HomeScreen from '../Screen/HomeScreen';
import LoginScreen from '../Screen/LoginScreen';
import ChatScreen from '../Chat/ChatScreen';

const Stack = createStackNavigator();

const Navigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{title: 'Login'}}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: 'Home'}}
        />
        <Stack.Screen
          name="ChatScreen"
          component={ChatScreen}
          options={{title: 'ChatScreen'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});
