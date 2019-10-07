export enum countLabels {
  ADDS_COUNT = 'addsCount',
  COMMENTS_COUNT = 'commentsCount',
  DONESCOUNT = 'donesCount',
  FRIENDS_COUNT = 'friendsCount',
  LIKES_COUNT = 'likesCount',
  MENTIONS_COUNT = 'mentionsCount',
  SHARES_COUNT = 'sharesCount',
  UNREAD_NOTIFICATIONS_COUNT = 'unreadNotificationsCount'
}

export enum eventNames {
  // App States
  APP_STATE_ACTIVE = 'APP_STATE_ACTIVE',
  APP_STATE_BACKGROUND = 'APP_STATE_BACKGROUND',

  // Friending
  SEND_FRIEND_REQUEST = 'SEND_FRIEND_REQUEST',
  ACCEPT_FRIEND_REQUEST = 'ACCEPT_FRIEND_REQUEST',
  REJECT_FRIEND_REQUEST = 'REJECT_FRIEND_REQUEST',
  DELETE_FRIEND_REQUEST = 'DELETE_FRIEND_REQUEST',
  REMOVE_A_FRIEND = 'REMOVE_A_FRIEND',

  // Shayring
  START_SHARE = 'START_SHARE',
  CONFIRM_SHARE = 'CONFIRM_SHARE',
  CANCEL_SHARE = 'CANCEL_SHARE',
  TOGGLE_ALL_FRIENDS = 'TOGGLE_ALL_FRIENDS',
  TOGGLE_FRIEND = 'TOGGLE_FRIEND',
  INVITE_FRIEND = 'INVITE_FRIEND',

  // Post Actions
  ADD_TO_LIST = 'ADD_TO_LIST',
  REMOVE_ADD = 'REMOVE_ADD',
  FRIENDS_COUNT = 'FRIENDS_COUNT',
  MARK_AS_DONE = 'MARK_AS_DONE',
  REMOVE_DONE = 'REMOVE_DONE',
  COMMENT = 'COMMENT'
}

export enum eventParamaters {
  COUNT = 'count',
  IS_ACTIVE = 'isActive',
  HAS_COMMENT = 'hasComment',
  COUNT_LABEL = 'countLabel'
}