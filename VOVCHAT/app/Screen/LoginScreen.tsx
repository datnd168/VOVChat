import ChatUtil from '../utils/ChatUtil';
import React, {useState, useEffect} from 'react';
import {Platform, TouchableOpacity} from 'react-native';
import {Text, View, TextInput, StyleSheet} from 'react-native';
// import {updateUserInfo,getListConvs} from '../redux/reducers/ChatSilce';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
let dat: 'eyJjdHkiOiJzdHJpbmdlZS1hcGk7dj0xIiwidHlwIjoiSldUIiwiYWxnIjoiSFMyNTYifQ.eyJqdGkiOiJTS1hFZXNOVEFwWE5iZ0xBTlFDb2I3UlhtbnBwNnpqN1V0LTE2MjU3Mzk0NjciLCJpc3MiOiJTS1hFZXNOVEFwWE5iZ0xBTlFDb2I3UlhtbnBwNnpqN1V0IiwiZXhwIjoxNjI4MzMxNDY3LCJ1c2VySWQiOiJkYXQifQ.AxviUhdvCeJLk_NFbQ0XIYKbU-dGlT1f_BNiSuNuPxc';
let thinh: 'eyJjdHkiOiJzdHJpbmdlZS1hcGk7dj0xIiwidHlwIjoiSldUIiwiYWxnIjoiSFMyNTYifQ.eyJqdGkiOiJTS1hFZXNOVEFwWE5iZ0xBTlFDb2I3UlhtbnBwNnpqN1V0LTE2MjU3Mzk0NzYiLCJpc3MiOiJTS1hFZXNOVEFwWE5iZ0xBTlFDb2I3UlhtbnBwNnpqN1V0IiwiZXhwIjoxNjI4MzMxNDc2LCJ1c2VySWQiOiJ0aGluaCJ9.IUje5dI-CqSiSXyBGckMEYWTmzdJgO0UgVN_shTeStc';

const LoginScreen = (props: any) => {
  const [token, setToken] = useState('');
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={token}
        placeholder="Nhập token"
        keyboardType="default"
        onChangeText={token => {
          setToken(token);
        }}
      />
      <TouchableOpacity
        style={[styles.login]}
        onPress={async () => {
          // console.log('logintoken',token);
          if (!token.length) return;
          await AsyncStorage.setItem('token', token);
          // props.updateUserInfo(token)
          props.navigation.replace('Home');

          // props.getListConvs();
        }}>
        <Text style={{color: 'white', fontSize: 17}}> Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    height: 50,
    width: '70%',
    backgroundColor: '#C9C9C9',
    alignSelf: 'center',
    marginVertical: 30,
    paddingHorizontal: 10,
  },
  login: {
    height: 30,
    backgroundColor: '#FF6E1E',
    width: '40%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
});

const mapStateToProps = state => ({});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
