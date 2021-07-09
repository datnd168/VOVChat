import ChatUtil from '../utils/ChatUtil';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {StringeeClient} from 'stringee-react-native-chat';
import AsyncStorage from '@react-native-community/async-storage';
import reactotron from 'reactotron-react-native';
import {updateUserStringee, onObjectChange} from '../redux/reducers/ChatSilce';
import {connect} from 'react-redux';

const Chat = (props: any) => {
  //   const token = props?.route?.params?.token;

  //   dat:eyJjdHkiOiJzdHJpbmdlZS1hcGk7dj0xIiwidHlwIjoiSldUIiwiYWxnIjoiSFMyNTYifQ.eyJqdGkiOiJTS1hFZXNOVEFwWE5iZ0xBTlFDb2I3UlhtbnBwNnpqN1V0LTE2MjU3Mzk0NjciLCJpc3MiOiJTS1hFZXNOVEFwWE5iZ0xBTlFDb2I3UlhtbnBwNnpqN1V0IiwiZXhwIjoxNjI4MzMxNDY3LCJ1c2VySWQiOiJkYXQifQ.AxviUhdvCeJLk_NFbQ0XIYKbU-dGlT1f_BNiSuNuPxc
  //   thinh:eyJjdHkiOiJzdHJpbmdlZS1hcGk7dj0xIiwidHlwIjoiSldUIiwiYWxnIjoiSFMyNTYifQ.eyJqdGkiOiJTS1hFZXNOVEFwWE5iZ0xBTlFDb2I3UlhtbnBwNnpqN1V0LTE2MjU3Mzk0NzYiLCJpc3MiOiJTS1hFZXNOVEFwWE5iZ0xBTlFDb2I3UlhtbnBwNnpqN1V0IiwiZXhwIjoxNjI4MzMxNDc2LCJ1c2VySWQiOiJ0aGluaCJ9.IUje5dI-CqSiSXyBGckMEYWTmzdJgO0UgVN_shTeStc

  React.useEffect(() => {
    connectStringee();
  }, []);

  const connectStringee = async () => {
    const token = await AsyncStorage.getItem('token');
    reactotron.log!('token', token);
    if (!token) return;
    ChatUtil.getStringeeClient().connect(token);
    reactotron.log!('token', token);
  };

  const _clientDidConnect = ({userId}) => {
    props.updateUserStringee(userId);
    reactotron.log!('_clientDidConnect - ' + userId);
  };
  const _clientDidDisConnect = ({userId}) => {
    reactotron.log!('_clientDidDisConnect - ' + userId);
  };

  const _clientDidFailWithError = () => {
    reactotron.log!('_clientDidFailWithError');
  };

  const _clientRequestAccessToken = () => {
    reactotron.log!('_clientRequestAccessToken');
    //  Bạn cần lấy token mới và gọi connect lại ở đây
    // this.refs.client.connect("NEW_TOKEN");
  };

  const _callIncomingCall = ({
    callId,
    from,
    to,
    fromAlias,
    toAlias,
    callType,
    isVideoCall,
    customDataFromYourServer,
  }) => {
    reactotron.log!(
      'IncomingCallId-' +
        callId +
        ' from-' +
        from +
        ' to-' +
        to +
        ' fromAlias-' +
        fromAlias +
        ' toAlias-' +
        toAlias +
        ' isVideoCall-' +
        isVideoCall +
        'callType-' +
        callType +
        'customDataFromYourServer-' +
        customDataFromYourServer,
    );
  };
  const onObjectChange = ({objectType, objectChanges, changeType}) => {
    const payload = {objectType, objectChanges, changeType};
    props.onObjectChange(payload);
  };

  const clientEventHandlers = {
    onConnect: _clientDidConnect,
    onDisConnect: _clientDidDisConnect,
    onFailWithError: _clientDidFailWithError,
    onRequestAccessToken: _clientRequestAccessToken,
    onIncomingCall: _callIncomingCall,
    onObjectChange: onObjectChange,
  };

  return (
    <StringeeClient
      ref={(stringeeClient: any) => {
        ChatUtil.setStringeeClient(stringeeClient);
      }}
      eventHandlers={clientEventHandlers}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
const mapStateToProps = state => ({
  chatState: state.chatReducer,
});

const mapDispatchToProps = {
  updateUserStringee,
  // getListConvs,
  onObjectChange,
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
