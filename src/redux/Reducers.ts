import { combineReducers } from 'redux';
import addsReducer from './adds/reducer';
import appReducer from './app/reducer';
import authReducer from './auth/reducer';
import donesReducer from './dones/reducer';
import friendshipsReducer from './friendships/reducer';
import friendshipsListsReducer from './friendshipsLists/reducer';
import likesReducer from './likes/reducer';
import postsReducer from './posts/reducer';
import routingReducer from './routing/reducer';
import sharesReducer from './shares/reducer';
import sharesListsReducer from './sharesLists/reducer';
import usersReducer from './users/reducer';
import usersListsReducer from './usersLists/reducer';
import usersPostsReducer from './usersPosts/reducer';
import usersPostsListsReducer from './usersPostsLists/reducer';

export const makeRootReducer = () =>
  combineReducers({
    adds: addsReducer,
    app: appReducer,
    auth: authReducer,
    dones: donesReducer,
    friendships: friendshipsReducer,
    friendshipsLists: friendshipsListsReducer,
    likes: likesReducer,
    posts: postsReducer,
    routing: routingReducer,
    shares: sharesReducer,
    sharesLists: sharesListsReducer,
    users: usersReducer,
    usersLists: usersListsReducer,
    usersPosts: usersPostsReducer,
    usersPostsLists: usersPostsListsReducer
  });

export default makeRootReducer;
