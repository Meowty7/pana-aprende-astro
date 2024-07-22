// src/firestoreOperations.js

import { db } from './firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const addUserScore = async (username, userId, score) => {
  try {
    // Reference to the 'scores' collection
    const scoresCollection = collection(db, 'scores');

    // Add a new document with the username, userId, and score
    await addDoc(scoresCollection, {
      username: username,
      userId: userId,
      score: score,
    });

    console.log('Score added successfully');
  } catch (error) {
    console.error('Error adding score:', error);
  }
};

export { addUserScore };
