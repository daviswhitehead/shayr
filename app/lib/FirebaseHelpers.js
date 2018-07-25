import firebase from 'react-native-firebase';

export const ts = firebase.firestore.FieldValue.serverTimestamp();

export const getUserId = (user) => {
  return user.uid;
}

export const getDocShares = (doc) => {
  return doc.collection('shares').get()
    .then((query) => {
      return query.docs
    })
    .catch((e) => {
      console.error(e);
      return false
    })
};

export const getRefData = (ref) => {
  return ref.get()
    .then((doc) => {
      return doc.data()
    })
    .catch((e) => {
      console.error(e);
      return false
    })
};

export const addPost = (user, postId) => {
  const ref = firebase.firestore().collection('users').doc(getUserId(user))
    .collection('postsMeta').doc(postId)
  return ref
    .get()
    .then((doc) => {
      if (!doc.exists) {
        ref.set({
          addCreatedAt: ts,
          addUpdatedAt: ts,
          addVisible: true
        })
      } else {
        ref.set({
          addUpdatedAt: ts,
          addVisible: true
        }, {
          merge: true
        })
      }
      console.log('addPost success');
    })
    .catch((error) => {
      console.error(error);
    });
}

export const donePost = (user, postId) => {
  return firebase.firestore().collection('users').doc(getUserId(user))
    .collection('postsMeta').doc(postId)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        ref.set({
          doneCreatedAt: ts,
          doneUpdatedAt: ts,
          doneVisible: true
        })
      } else {
        ref.set({
          doneUpdatedAt: ts,
          doneVisible: true
        }, {
          merge: true
        })
      }
    })
    .then((ref) => {
      console.log('donePost success');
    })
    .catch((error) => {
      console.error(error);
    });
}

export const removeAddedPost = (user, postId) => {
  return firebase.firestore().collection('users').doc(getUserId(user))
    .collection('postsMeta').doc(postId)
    .update({
      addUpdatedAt: ts,
      addVisible: false
    })
    .then((ref) => {
      console.log('removeAddedPost success');
    })
    .catch((error) => {
      console.error(error);
    });
}
