import React, { Component } from 'react';
import {
  Text,
  View,
  Button,
  Modal,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import firebase from 'react-native-firebase';

const createShare = (ref, url) => {
  const ts = firebase.firestore.FieldValue.serverTimestamp();
  return ref.doc("testUser").collection('shares')
    .add({
      createdAt: ts,
      updatedAt: ts,
      url: url
    })
    .then((ref) => {
      console.log("Document successfully written!");
      return ref
    })
    .catch((error) => {
      console.error(error);
      return false
    });
}

export default class MyComponent extends Component {
  constructor() {
    super();
    this.ref = firebase.firestore().collection('users');
    this.state = {
      modalVisible: true,
      shareText: 'Shayring...'
    };
  }

  async componentDidMount() {
    try {
      // const { type, value } = await ShareExtension.data()
      // this.setState({
      //   type,
      //   value
      // })
      this.url = 'https://www.nytimes.com/2018/04/03/business/media/spotifys-wall-street-debut-is-a-success.html';
      this.share = await createShare(this.ref, this.url);
      if (this.share) {
        setTimeout(
          () => {this.setState({shareText: 'Success!'})},
          1000
        )

      }
      else {
        setTimeout(
          () => {this.setState({shareText: 'Failed.'})},
          3000
        )

      }
    }
    catch(error) {
      console.log(error);
    }
  }

  openModal() {
    this.setState({modalVisible:true});
  }

  closeModal() {
    this.setState({modalVisible:false});
  }

  render() {
    return (
        <Modal
            visible={this.state.modalVisible}
            animationType={'slide'}
            onRequestClose={() => this.closeModal()}
            transparent={true}
        >
          <TouchableWithoutFeedback
            onPress={() => {this.closeModal()}}
          >
            <View style={styles.container}>
              <TouchableOpacity
                onPress={() => {}}
                style={styles.modal}
              >
                <Image
                  source={require('../components/ShareExtensionLogo.png')}
                  style={styles.logo}
                  >
                </Image>
                <Text style={styles.text}>
                  {this.state.shareText}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#F2C94C',
    height: 60,
    width: 60*4,
    marginBottom: 100,
    borderRadius: 60,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  logo: {
    height: 60,
    width: 60,
  },
  text: {
    textAlign: 'center',
    fontSize: 30,
  },
});