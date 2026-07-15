import { collection, addDoc, deleteDoc, getDocs, updateDoc, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../config/firebase";

const familiesRef = collection(db, "families");
export async function getFamilies() {
  const snapshot = await getDocs(query(familiesRef, orderBy("name")));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}
export const addFamily = (data) => addDoc(familiesRef, data);
export const deleteFamily = (id) => deleteDoc(doc(db, "families", id));
export const updateFamily = (id, data) => updateDoc(doc(db, "families", id), data);
export const subscribeFamilies = (callback) => onSnapshot(query(familiesRef, orderBy("name")), (snapshot) => callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))));
