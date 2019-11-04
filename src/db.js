// haircut/src/db.js

const config = require('@root/config');
const Firestore = require('@google-cloud/firestore');
const db = new Firestore({
  projectId: config.projectId,
  keyFilename: process.env.GCP_KEY_FILE,
});

const handleDbError = (err, message) => {
  console.error(`${message}:\n${err}`);
  throw new Error(`${message}:\n${err}`);
};

const parseLinkedInPhotos = photos => {
  return photos;
};

const getUser = async id => {
  return await db
    .collection('users')
    .doc(id)
    .get()
    .then(doc => {
      return doc.data();
    })
    .catch(err => {
      console.log(err);
      return err;
    });
};

// Given a stringified JSON object with expected fields
// Create a document in the users collection on Firebase
const createUser = async user => {
  console.log('createUser');
  try {
    const newUser = JSON.parse(user);
    const now = new Date();
    const userRef = await db
      .collection('users')
      .doc(newUser.id)
      .set(
        {
          givenName: newUser.name.givenName,
          familyName: newUser.name.familyName,
          displayName: newUser.displayName,
          email: newUser.emails[0].value,
          photos: parseLinkedInPhotos(newUser.photos),
          createdAt: now,
          updatedAt: now,
        },
        {merge: true},
      );
    const x = await getUser(newUser.id);
    return x;
  } catch (err) {
    handleDbError(err, 'Problem saving user');
  }
};

module.exports = {
  createUser,
  getUser,
};
