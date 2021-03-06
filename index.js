import { AppRegistry } from 'react-native';
import Config from 'react-native-config';
import { devSettings } from './dev';
import Promise from 'bluebird';

if (Config.ENV_NAME !== 'prod') {
  devSettings();

  // https://stackoverflow.com/questions/48487089/global-unhandledrejection-listener-in-react-native/49129335#49129335
  // We use the "Bluebird" lib for Promises, because it shows good perf
  // and it implements the "unhandledrejection" event:
  global.Promise = Promise;

  // Global catch of unhandled Promise rejections:
  global.onunhandledrejection = function onunhandledrejection(error) {
    // Warning: when running in "remote debug" mode (JS environment is Chrome browser),
    // this handler is called a second time by Bluebird with a custom "dom-event".
    // We need to filter this case out:
    if (error instanceof Error) {
      console.error(error); // Your custom error logging/reporting code
    }
  };
}
AppRegistry.registerComponent(
  'shayr',
  () => require('./src/containers/App').default
);
// AppRegistry.registerComponent(
//   'shayr',
//   () => require('./src/containers/ShareApp').default
// );
AppRegistry.registerComponent(
  'ShareExtension',
  () => require('./src/containers/ShareApp').default
);
