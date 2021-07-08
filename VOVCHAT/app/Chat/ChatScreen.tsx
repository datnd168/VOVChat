import React, {useCallback, useEffect, useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Actions, GiftedChat, LoadEarlier, Send} from 'react-native-gifted-chat';
import {connect} from 'react-redux';
import ChatUtil from '../utils/ChatUtil';
const isEqual = require('react-fast-compare');
// import Fire from '../utils/FirebaseConfig';
// import ImagePicker from 'react-native-image-crop-picker';

const ChatScreen = ({chatState, getListConvs, getListMessages, route}) => {
  var currentStringeeId = chatState?.stringeeUser?.userId;
  console.log('currentStringeeId', currentStringeeId);
  console.log('ID', route?.params?.item?.id);
  const [imageUri, setImageUri] = useState('');
  const [imgLocal, setImageLocal] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  //   useEffect(() => {
  //     sendImage();
  //   }, [imageUri]);

  //   useEffect(() => {
  //     getListMessages(route.params.item?.id);
  //     ChatUtil.getStringeeClient().markConversationAsRead(
  //       route.params.item?.id,
  //       function (status, code, message) {
  //         // markConversation(route.params?.item);
  //       },
  //     );
  //   }, []);

  const onSend = useCallback(async (messages = []) => {
    var txtMsg = {
      type: 1,
      convId: route.params.item?.id,
      message: {
        content: messages[0].text,
      },
    };
    await new Promise((resolve, reject) => {
      ChatUtil.getStringeeClient().sendMessage(
        txtMsg,
        function (status, code, message, msg) {
          console.log('status', status, code, message);
          resolve(msg);
          console.log('messgae', msg);
        },
      );
    });
    // getListConvs()
  }, []);

  const sendImage = async () => {
    if (!imageUri) return;
    var imageMsg = {
      type: 2,
      convId: route.params.item.id,
      message: {
        photo: {
          filePath: imageUri,
          thumbnail: imageUri,
          ratio: 1,
        },
      },
    };
    await new Promise((resolve, reject) => {
      ChatUtil.getStringeeClient().sendMessage(
        imageMsg,
        function (status, code, message, msg) {
          resolve(msg);
          setImageUri('');
        },
      );
    });
  };

  const formatMess = chatState?.messages?.map(mes => {
    const currentStringeeId = chatState.stringeeUser?.userId;
    // reactotron.log('currentStringeeId',chatState)
    var userId =
      route.params.item.participants[0].userId === currentStringeeId
        ? route.params.item.participants[1].userId
        : route.params.item.participants[0].userId;
    var urlAvatar = `https://znews-photo.zadn.vn/w660/Uploaded/qhj_yvobvhfwbv/2018_07_18/Nguyen_Huy_Binh1.jpg`;
    return {
      _id: mes.id + mes.createdAt,
      user: {
        _id: mes.sender,
        name: route.params.conversationName,
        avatar: urlAvatar,
      },
      type: 'text',
      image:
        mes.content && typeof mes.content.photo == 'object'
          ? mes.content.photo.filePath || mes.content.photo.thumbnail
          : '',
      text:
        typeof mes.content.content == 'string'
          ? mes.content.content
          : !mes.content.photo
          ? 'Xin chào'
          : '',
      createdAt: new Date(mes.createdAt),
    };
  });

  const renderActions = props => {
    return (
      <Actions
        {...props}
        icon={() => (
          <Image
            source={require('../assets/images/ic_photo.png')}
            style={{
              width: 30,
              height: 30,
              aspectRatio: 1,
              marginBottom: 20,
            }}
            resizeMode="contain"
          />
        )}
        onPressActionButton={async () => {}}
      />
    );
  };

  const renderSend = props => (
    <Send
      {...props}
      containerStyle={{
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: '2%',
      }}>
      <Image
        source={require('../assets/images/ic_send.png')}
        style={{
          width: 35,
          aspectRatio: 1,
        }}
        resizeMode="contain"
      />
    </Send>
  );

  return (
    <View style={styles.container}>
      <GiftedChat
        // messages={formatMess}
        // onSend={messages => onSend(messages)}
        // renderSend={renderSend}
        // renderActions={renderActions}
        // user={{_id: currentStringeeId}}
        isLoadingEarlier={true}
        maxInputLength={200}
        timeFormat="HH:mm"
        dateFormat="DD//MM/YYYY"
        placeholder="Tin nhắn ..."
        isCustomViewBottom
        renderLoading={() => {
          return (
            <LoadEarlier
              wrapperStyle={{backgroundColor: '#C61D23'}}
              textStyle={{color: 'white'}}
              label={'Đang tải...'}
            />
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'pink',
  },
});

const mapStateToProps = state => ({
  //   chatState: state.chatReducer,
});

const mapDispatchToProps = {
  //   getListConvs,
  //   getListMessages,
  //   markConversation,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen);
