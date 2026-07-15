import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";

const settingsRef = doc(db, "settings", "app");

export async function getSettings() {
  const snapshot = await getDoc(settingsRef);

  if (!snapshot.exists()) {
    throw new Error("Dokument settings/app nebyl nalezen.");
  }

  return snapshot.data();
}

export async function updateSettings(data) {
  await updateDoc(settingsRef, data);
}