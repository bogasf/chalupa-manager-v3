import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";

const activitiesRef = collection(db, "activities");

export async function addActivity({
  type,
  title,
  description,
  user = "",
  icon = "📌",
}) {
  await addDoc(activitiesRef, {
    type,
    title,
    description,
    user,
    icon,
    createdAt: serverTimestamp(),
  });
}

export function subscribeActivities(callback) {
  const q = query(
    activitiesRef,
    orderBy("createdAt", "desc"),
    limit(20)
  );

  return onSnapshot(q, (snapshot) => {
    callback(
      snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
    );
  });
}