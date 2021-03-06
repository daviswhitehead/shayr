import { Batcher, documentId } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import firebase from 'react-native-firebase';
import { Dispatch } from 'redux';
import { Toaster } from '../../components/Toaster';
import { logEvent } from '../../lib/FirebaseAnalytics';
import { ts } from '../../lib/FirebaseHelpers';
import { getQuery, queryTypes } from '../../lib/FirebaseQueries';
import { overwriteUserCounts, updateCounts } from '../../lib/FirebaseWrites';
import { subscribeToAllDocuments } from '../../redux/FirebaseRedux';
import {
  actionTypeActiveToasts,
  actionTypeInactiveToasts
} from '../../styles/Copy';
import { toggleItem } from '../lists/actions';
import { refreshUsersPostsDocuments } from '../usersPosts/actions';

export const STATE_KEY = 'likes';

export const types = {
  TOGGLE_LIKE_POST_START: 'TOGGLE_LIKE_POST_START',
  TOGGLE_LIKE_POST_SUCCESS: 'TOGGLE_LIKE_POST_SUCCESS',
  TOGGLE_LIKE_POST_FAIL: 'TOGGLE_LIKE_POST_FAIL',
  UPDATE_USER_LIKES_START: 'UPDATE_USER_LIKES_START',
  UPDATE_USER_LIKES_SUCCESS: 'UPDATE_USER_LIKES_SUCCESS',
  UPDATE_USER_LIKES_FAIL: 'UPDATE_USER_LIKES_FAIL'
};

export const toggleLikePost = (
  isActive: boolean,
  postId: documentId,
  ownerUserId: documentId,
  userId: documentId
) => async (dispatch: Dispatch) => {
  dispatch({
    type: types.TOGGLE_LIKE_POST_START
  });

  logEvent(`${types.TOGGLE_LIKE_POST_START}`.toUpperCase());

  try {
    // toast
    !isActive
      ? Toaster(actionTypeActiveToasts.likes)
      : Toaster(actionTypeInactiveToasts.likes);

    const batcher = new Batcher(firebase.firestore());

    // likes/{userId}_{postId}
    batcher.set(
      firebase
        .firestore()
        .collection('likes')
        .doc(`${userId}_${postId}`),
      {
        active: !isActive,
        postId,
        updatedAt: ts,
        userId
      },
      {
        merge: true
      }
    );

    updateCounts(batcher, !isActive, 'likes', postId, ownerUserId, userId);

    await batcher.write();

    dispatch(refreshUsersPostsDocuments(postId, 'server'));
    // dispatch(refreshUsersPostsDocuments(postId, 'cache'));
    dispatch(
      toggleItem(
        'usersPostsLists',
        `${userId}_${queryTypes.USERS_POSTS_LIKES}`,
        `${userId}_${postId}`,
        !isActive
      )
    );

    dispatch({
      type: types.TOGGLE_LIKE_POST_SUCCESS
    });
  } catch (error) {
    console.error(error);
    dispatch({
      type: types.TOGGLE_LIKE_POST_FAIL,
      error
    });
  }
};

export const subscribeToLikes = (userId: string) => {
  return (dispatch: Dispatch) => {
    return subscribeToAllDocuments(
      dispatch,
      STATE_KEY,
      getQuery(queryTypes.USER_LIKES)(userId),
      userId,
      queryTypes.USER_LIKES
    );
  };
};

export const updateUserLikes = (userId: string, value: number) => async (
  dispatch: Dispatch
) => {
  dispatch({ type: types.UPDATE_USER_LIKES_START });

  const batcher = new Batcher(firebase.firestore());

  overwriteUserCounts(batcher, 'likes', userId, value);

  await batcher.write();

  dispatch({ type: types.UPDATE_USER_LIKES_SUCCESS });
};
