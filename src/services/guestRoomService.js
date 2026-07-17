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

const guestRoomRef = collection(db, "guestRoomReservations");

export async function addGuestRoomReservation(data) {
  return addDoc(guestRoomRef, {
    ...data,
    paid: false,
    paidAt: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateGuestRoomReservation(id, data) {
  return updateDoc(doc(db, "guestRoomReservations", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteGuestRoomReservation(id) {
  return deleteDoc(doc(db, "guestRoomReservations", id));
}

export function subscribeGuestRoomReservations(callback) {
  const q = query(
    guestRoomRef,
    orderBy("arrival", "desc")
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

export function subscribeLastGuestRoomReservation(callback) {
  const q = query(
    guestRoomRef,
    orderBy("arrival", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    if (snapshot.empty) {
      callback(null);
      return;
    }

    callback({
      id: snapshot.docs[0].id,
      ...snapshot.docs[0].data(),
    });
  });
}

/**
 * Vrátí true pokud existuje kolize rezervací
 */
export function hasReservationConflict(
  reservations,
  arrival,
  departure,
  currentId = null
) {
  const newArrival = new Date(arrival);
  const newDeparture = new Date(departure);

  return reservations.some((reservation) => {
    if (reservation.id === currentId) {
      return false;
    }

    const existingArrival = new Date(reservation.arrival);
    const existingDeparture = new Date(reservation.departure);

    return (
      newArrival < existingDeparture &&
      newDeparture > existingArrival
    );
  });
}

/**
 * Vrátí konkrétní kolidující rezervaci
 */
export function findReservationConflict(
  reservations,
  arrival,
  departure,
  currentId = null
) {
  const newArrival = new Date(arrival);
  const newDeparture = new Date(departure);

  return (
    reservations.find((reservation) => {
      if (reservation.id === currentId) {
        return false;
      }

      const existingArrival = new Date(reservation.arrival);
      const existingDeparture = new Date(reservation.departure);

      return (
        newArrival < existingDeparture &&
        newDeparture > existingArrival
      );
    }) || null
  );
}