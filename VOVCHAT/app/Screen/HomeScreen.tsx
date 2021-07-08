import ChatUtil from '../utils/ChatUtil';
import React, {useState, useEffect} from 'react';
import {TouchableOpacity} from 'react-native';
import {Text, View, TextInput, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import Chat from '../Chat/Chat';

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
            // if (!user.length) return;
            // props.navigation.navigate('ChatScreen');
            ChatUtil.getStringeeClient().createConversation(
              userIds,
              options,
              (status, code, message, conversation) => {
                console.log(
                  'status-' +
                    status +
                    ' code-' +
                    code +
                    ' message-' +
                    message +
                    ' conversation-' +
                    conversation,
                );
              },
            );
          }}>
          <Text style={{color: 'white', fontSize: 17}}> Chat</Text>
        </TouchableOpacity>
      </View>
      <Chat />
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
