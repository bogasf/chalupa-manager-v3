import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "../config/firebase";

const visitsRef = collection(db, "visits");

export async function addVisit(data) {
  return addDoc(visitsRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateVisit(id, data) {
  return updateDoc(doc(db, "visits", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteVisit(id) {
  return deleteDoc(doc(db, "visits", id));
}

export async function getVisit(id) {
  const snapshot = await getDoc(doc(db, "visits", id));

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}

export function subscribeVisits(callback) {
  const q = query(visitsRef, orderBy("arrival"));

  return onSnapshot(q, (snapshot) => {
    callback(
      snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
    );
  });
}