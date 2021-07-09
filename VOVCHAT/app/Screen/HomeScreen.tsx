import ChatUtil from '../utils/ChatUtil';
import React, {useState, useEffect} from 'react';
import {TouchableOpacity} from 'react-native';
import {Text, View, TextInput, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import Chat from '../Chat/Chat';
import reactotron from 'reactotron-react-native';

const HomeScreen = (props: any) => {
  const [user, setUser] = useState('');

  return (
    <>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          value={user}
          placeholder="Nhập người chat"
          keyboardType="default"
          onChangeText={user => {
            setUser(user);
          }}
        />
        <TouchableOpacity
          style={[styles.login]}
          onPress={async () => {
            var userIds = [user];
            var options = {
              name: 'Your conversation name',
              isDistinct: true,
              isGroup: false,
            };
            if (!user.length) return;
            ChatUtil.getStringeeClient().createConversation(
              userIds,
              options,
              (status, code, message, conversation) => {
                if (status) {
                  props.navigation.navigate('ChatScreen', {
                    item: conversation,
                    conversationName: options.name,
                  });
                }
                reactotron.log(
                  'status-' +
                    status +
                    ' code-' +
                    code +
                    ' message-' +
                    message +
                    ' conversation-' +
                    conversation.id,
                );
              },
            );
          }}>
          <Text style={{color: 'white', fontSize: 17}}> Chat</Text>
        </TouchableOpacity>

        <Text
          style={{textAlign: 'center', fontSize: 20, color: 'red'}}
          onPress={() => {
            ChatUtil.getStringeeClient().disconnect();
            props.navigation.replace('Login');
          }}
          children={'Ngat ket noi'}
        />
      </View>
    </>
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
