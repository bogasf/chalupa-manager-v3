import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc
} from "firebase/firestore";

import { db } from "../config/firebase";

const familiesRef = collection(db, "families");

export async function getFamilies() {
  const snapshot = await getDocs(familiesRef);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

export async function addFamily(data) {
  return await addDoc(familiesRef, data);
}

export async function deleteFamily(id) {
  return await deleteDoc(doc(db, "families", id));
}

export async function updateFamily(id, data) {
  return await updateDoc(doc(db, "families", id), data);
}