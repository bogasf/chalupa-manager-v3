import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "../config/firebase";

const workTypesRef = collection(db, "workTypes");

export async function getWorkTypes() {
  const q = query(workTypesRef, orderBy("order"));

  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
}

export function subscribeWorkTypes(callback) {
  const q = query(workTypesRef, orderBy("order"));

  return onSnapshot(q, (snapshot) => {
    callback(
      snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }))
    );
  });
}

export async function addWorkType(data) {
  return addDoc(workTypesRef, data);
}

export async function updateWorkType(id, data) {
  return updateDoc(doc(db, "workTypes", id), data);
}

export async function deleteWorkType(id) {
  return deleteDoc(doc(db, "workTypes", id));
}