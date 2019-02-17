import React, { Component } from 'react';
import {
  View, Image, Text, TouchableWithoutFeedback,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { LoginButton } from 'react-native-fbsdk';
import { facebookAuthTap, facebookAuth, signOutUser } from './actions';
import styles from './styles';
import vectorLogo from '../../assets/VectorLogo.png';

const mapStateToProps = state => ({
  appListeners: state.appListeners,
});

const mapDispatchToProps = dispatch => ({
  facebookAuthTap: () => dispatch(facebookAuthTap()),
  facebookAuth: (error, result) => dispatch(facebookAuth(error, result)),
  signOutUser: () => dispatch(signOutUser()),
});

class Login extends Component {
  static propTypes = {
    appListeners: PropTypes.instanceOf(Object).isRequired,
    navigation: PropTypes.instanceOf(Object).isRequired,
    facebookAuthTap: PropTypes.func.isRequired,
    facebookAuth: PropTypes.func.isRequired,
    signOutUser: PropTypes.func.isRequired,
  };

  componentDidMount() {
    if (this.props.appListeners.user) {
      this.props.signOutUser();
    }
  }

  componentDidUpdate() {
    if (this.props.appListeners.user && this.props.appListeners.hasAccessToken) {
      this.props.navigation.navigate('AuthWithListeners');
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.brandContainer}>
          <Image style={styles.image} source={vectorLogo} />
          <Text style={styles.brand}>shayr</Text>
          <Text style={styles.tagline}>discover together</Text>
        </View>
        <View style={styles.loginContainer}>
          <TouchableWithoutFeedback onPress={this.props.facebookAuthTap}>
            <LoginButton
              readPermissions={['public_profile', 'email']}
              onLoginFinished={(error, result) => this.props.facebookAuth(error, result)}
              onLogoutFinished={() => this.props.signOutUser()}
            />
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login);
