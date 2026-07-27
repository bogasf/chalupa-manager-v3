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

const ref = collection(db, "fixedCosts");

export function subscribeFixedCosts(callback) {
  return onSnapshot(
    query(ref, orderBy("from", "desc")),
    (snapshot) => {
      callback(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    }
  );
}

export async function addFixedCost(data) {
  return addDoc(ref, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateFixedCost(id, data) {
  return updateDoc(doc(db, "fixedCosts", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteFixedCost(id) {
  return deleteDoc(doc(db, "fixedCosts", id));
}