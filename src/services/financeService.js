import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";
const transactionsRef = collection(db, "transactions");
export const subscribeTransactions = (callback) => onSnapshot(query(transactionsRef, orderBy("date", "desc")), (snapshot) => callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))));
export const addTransaction = (data) => addDoc(transactionsRef, { ...data, createdAt: serverTimestamp() });
export const deleteTransaction = (id) => deleteDoc(doc(db, "transactions", id));
