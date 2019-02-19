import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import firebase from 'react-native-firebase';
import { AppState } from 'react-native';
import {
  notificationDisplayedListener,
  notificationListener,
  notificationOpenedListener,
} from '../../lib/NotificationListeners';
import { notificationChannels } from '../../lib/NotificationChannels';
import { authSubscription, hasAccessToken, areListenersReady } from '../../redux/auth/actions';
import RootNavigator from '../../config/Routes';
import AppLoading from '../../components/AppLoading';

const mapStateToProps = state => ({
  auth: state.auth,
});

const mapDispatchToProps = dispatch => ({
  authSubscription: () => dispatch(authSubscription()),
  hasAccessToken: () => dispatch(hasAccessToken()),
  areListenersReady: areReady => dispatch(areListenersReady(areReady)),
});

class AppWithListeners extends Component {
  static propTypes = {
    auth: PropTypes.instanceOf(Object).isRequired,
    authSubscription: PropTypes.func.isRequired,
    hasAccessToken: PropTypes.func.isRequired,
    areListenersReady: PropTypes.func.isRequired,
  };

  async componentDidMount() {
    // listen to app state changes
    AppState.addEventListener('change', this.handleAppStateChange);

    // check authentication and listen for updates
    this.unsubscribeAuthListener = this.props.authSubscription();
    this.props.hasAccessToken();

    // setup android notification channels
    notificationChannels.forEach((channel) => {
      firebase.notifications().android.createChannel(channel);
    });

    // start notification listeners
    this.notificationDisplayedListener = notificationDisplayedListener();
    this.notificationListener = notificationListener();
    this.notificationOpenedListener = notificationOpenedListener();

    // app launched by notification tap
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
      const { action, notification } = notificationOpen;
      firebase.notifications().removeDeliveredNotification(notification.notificationId);
    }

    // app launched with dynamic link
    firebase
      .links()
      .getInitialLink()
      .then((url) => {
        console.log(url);
      });
    this.props.areListenersReady(true);
  }

  componentWillUnmount() {
    AppState.auth.removeEventListener('change', this.handleAppStateChange);
    this.unsubscribeAuthListener();
    this.notificationDisplayedListener();
    this.notificationListener();
    this.notificationOpenedListener();
    this.props.areListenersReady(false);
  }

  handleAppStateChange = (nextAppState) => {
    // https://facebook.github.io/react-native/docs/appstate
    if (nextAppState === 'active') {
      // clear notification badge
      firebase.notifications().setBadge(0);
      firebase.notifications().removeAllDeliveredNotifications();
    }
  };

  render() {
    if (this.props.auth.listenersReady) {
      const prefix = 'https://shayr/';
      return <RootNavigator uriPrefix={prefix} />;
    }
    return <AppLoading />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppWithListeners);
