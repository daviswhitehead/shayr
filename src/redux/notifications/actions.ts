import firebase from 'react-native-firebase';
import { Query } from 'react-native-firebase/firestore';
import { Dispatch } from 'redux';
import { ts } from '../../lib/FirebaseHelpers';
import { composeQuery } from '../../lib/FirebaseQueries';
import { requestNotificationPermissions } from '../../lib/Notifications';
import { getFeedOfDocuments, LastItem } from '../FirebaseRedux';

export const STATE_KEY = 'notifications';

export const types = {
  // PERMISSIONS
  NOTIFICATION_PERMISSIONS_REQUEST_START:
    'NOTIFICATION_PERMISSIONS_REQUEST_START',
  NOTIFICATION_PERMISSIONS_REQUEST_SUCCESS:
    'NOTIFICATION_PERMISSIONS_REQUEST_SUCCESS',
  NOTIFICATION_PERMISSIONS_REQUEST_FAIL:
    'NOTIFICATION_PERMISSIONS_REQUEST_FAIL',

  // NOTIFICATION TOKEN REFRESH
  SUBSCRIBE_NOTIFICATION_TOKEN_REFRESH_START:
    'SUBSCRIBE_NOTIFICATION_TOKEN_REFRESH_START',
  SUBSCRIBE_NOTIFICATION_TOKEN_REFRESH_SUCCESS:
    'SUBSCRIBE_NOTIFICATION_TOKEN_REFRESH_SUCCESS',
  SUBSCRIBE_NOTIFICATION_TOKEN_REFRESH_FAIL:
    'SUBSCRIBE_NOTIFICATION_TOKEN_REFRESH_FAIL'
};

const saveNotificationToken = async (userId: string, token: string) => {
  const didTokenUpdate = await firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .update({ pushToken: token, updatedAt: ts })
    .then(() => true)
    .catch((error) => {
      console.error(error);
      return false;
    });
  return didTokenUpdate;
};

// PERMISSIONS
export const requestNotificationPermissionsRedux = async (
  userId: string,
  dispatch: Dispatch
) => {
  dispatch({ type: types.NOTIFICATION_PERMISSIONS_REQUEST_START });
  const token = await requestNotificationPermissions();

  if (token) {
    dispatch({ type: types.NOTIFICATION_PERMISSIONS_REQUEST_SUCCESS });
    saveNotificationToken(userId, token);
  } else {
    dispatch({ type: types.NOTIFICATION_PERMISSIONS_REQUEST_FAIL });
  }
};

// NOTIFICATION TOKEN REFRESH
export const subscribeNotificationTokenRefresh = (userId: string) =>
  function _subscribeNotificationTokenRefresh(dispatch: Dispatch) {
    dispatch({ type: types.SUBSCRIBE_NOTIFICATION_TOKEN_REFRESH_START });
    requestNotificationPermissionsRedux(userId, dispatch);

    return firebase
      .messaging()
      .onTokenRefresh((notificationToken) =>
        saveNotificationToken(userId, notificationToken)
      );
  };

// LOAD NOTIFICATIONS
const requestLimiter = 10;
export const loadNotifications = (
  listKey: string,
  query: Query,
  shouldRefresh?: boolean,
  isLoading?: boolean,
  lastItem?: LastItem
) => (dispatch: Dispatch) => {
  const composedQuery: Query = composeQuery(
    query,
    requestLimiter,
    shouldRefresh ? undefined : lastItem
  );
  getFeedOfDocuments(
    dispatch,
    STATE_KEY,
    listKey,
    composedQuery,
    shouldRefresh,
    isLoading,
    lastItem
  );
};
