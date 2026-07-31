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

const workRef = collection(db, "workEntries");

export const subscribeWorkEntries = (callback) =>
  onSnapshot(
    query(workRef, orderBy("date", "desc")),
    (snapshot) =>
      callback(
        snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }))
      )
  );

export const addWorkEntry = async (data) => {
  return await addDoc(workRef, {
    ...data,
    photos: data.photos ?? [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const updateWorkEntry = async (id, data) => {
  return await updateDoc(doc(db, "workEntries", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deleteWorkEntry = async (id) => {
  return await deleteDoc(doc(db, "workEntries", id));
};