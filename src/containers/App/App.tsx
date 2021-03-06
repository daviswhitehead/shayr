import React from 'react';
import { Platform } from 'react-native';
import codePush from 'react-native-code-push';
import SplashScreen from 'react-native-splash-screen';
import { Provider } from 'react-redux';
import { applyFirebaseSettings } from '../../config/FirebaseConfig';
import { bugsnag } from '../../lib/Bugsnag';
import createStore from '../../redux/CreateStore';
import AppLoading from '../AppLoading';

const store = createStore();

class App extends React.Component<{}> {
  componentDidMount() {
    if (Platform.OS === 'android') {
      SplashScreen.hide();
    }

    // apply firebase settings before any other firebase calls
    applyFirebaseSettings();
  }

  render() {
    return (
      <Provider store={store}>
        <AppLoading />
      </Provider>
    );
  }
}

export default codePush()(App);
