import Navigator from './app/navigation/Navigator';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Provider} from 'react-redux';
import store from './app/redux/store';
import Chat from './app/Chat/Chat';
export default function App() {
  return (
    <Provider store={store}>
      <Navigator />
      <Chat />
    </Provider>
  );
}

const styles = StyleSheet.create({});
