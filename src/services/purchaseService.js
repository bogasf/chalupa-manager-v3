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

const purchasesRef = collection(db, "purchases");

export function subscribePurchases(callback) {
  const q = query(purchasesRef, orderBy("date", "desc"));

  return onSnapshot(q, (snapshot) => {
    const purchases = snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));

    callback(purchases);
  });
}

export async function addPurchase(data) {
  return addDoc(purchasesRef, {
    familyId: data.familyId,
    family: data.family,
    date: data.date,
    name: data.name,
    amount: Number(data.amount),
    note: data.note ?? "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updatePurchase(id, data) {
  return updateDoc(doc(db, "purchases", id), {
    familyId: data.familyId,
    family: data.family,
    date: data.date,
    name: data.name,
    amount: Number(data.amount),
    note: data.note ?? "",
    updatedAt: serverTimestamp(),
  });
}

export async function deletePurchase(id) {
  return deleteDoc(doc(db, "purchases", id));
}