import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "../config/firebase";

const gasRef = collection(db, "gasReadings");

export async function addGasReading(data) {
  return addDoc(gasRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateGasReading(id, data) {
  return updateDoc(doc(db, "gasReadings", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteGasReading(id) {
  return deleteDoc(doc(db, "gasReadings", id));
}

export function subscribeGasReadings(callback) {
  const q = query(gasRef, orderBy("date", "desc"));

  return onSnapshot(q, (snapshot) => {
    callback(
      snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }))
    );
  });
}
export function subscribeLastGasReading(callback) {
  const q = query(gasRef, orderBy("date", "desc"));

  return onSnapshot(q, (snapshot) => {
    if (snapshot.empty) {
      callback(null);
      return;
    }

    const last = snapshot.docs[0];

    callback({
      id: last.id,
      ...last.data(),
    });
  });
}