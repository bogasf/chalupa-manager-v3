import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
const workRef = collection(db, "workEntries");
export const subscribeWorkEntries = (callback) => onSnapshot(query(workRef, orderBy("date", "desc")), (snapshot) => callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))));
export const addWorkEntry = (data) => addDoc(workRef, { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
export const updateWorkEntry = (id, data) => updateDoc(doc(db, "workEntries", id), { ...data, updatedAt: serverTimestamp() });
export const deleteWorkEntry = (id) => deleteDoc(doc(db, "workEntries", id));
