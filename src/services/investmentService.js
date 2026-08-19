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

const ref = collection(db, "investments");

export function subscribeInvestments(callback) {
  return onSnapshot(
    query(ref, orderBy("date", "desc")),
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

export async function addInvestment(data) {
  return addDoc(ref, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateInvestment(id, data) {
  return updateDoc(doc(db, "investments", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteInvestment(id) {
  return deleteDoc(doc(db, "investments", id));
}