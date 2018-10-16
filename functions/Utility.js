const config = require("./Config");
const URL = require("url");
const ts = config.admin.firestore.FieldValue.serverTimestamp();

exports.ts = ts;

exports.addCreatedAt = payload => {
  return {
    ...payload,
    createdAt: ts
  };
};

exports.addUpdatedAt = payload => {
  return {
    ...payload,
    updatedAt: ts
  };
};

exports.addDeletedAt = payload => {
  return {
    ...payload,
    deletedAt: ts
  };
};

exports.getReferenceId = (reference, position) => {
  return reference.split("/")[position];
};

exports.getDocument = (query, ref) => {
  // query = db.doc(ref)
  return query.get().then(queryDocumentSnapshot => {
    if (queryDocumentSnapshot.exists) {
      return {
        id: queryDocumentSnapshot.id,
        ref: ref,
        ...queryDocumentSnapshot.data()
      };
    }
    return false;
  });
};

exports.getDocumentsInCollection = (query, ref) => {
  // query = db.collection(ref).where("a", "==", "b")
  const obj = {};
  return query.get().then(querySnapshot => {
    if (!querySnapshot.empty) {
      querySnapshot.forEach(doc => {
        obj[doc.id] = {
          ref: ref + `/${doc.id}`,
          ...doc.data()
        };
      });
      return obj;
    }
    return false;
  });
};

exports.returnBatch = batch => {
  return batch
    .commit()
    .then(value => {
      console.log("success");
      return value;
    })
    .catch(e => {
      console.log("failure");
      console.error(e);
      return e;
    });
};
