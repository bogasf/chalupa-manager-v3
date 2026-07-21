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

/**
 * Vytvoření nové rezervace
 */
export async function addGuestRoomReservation(data) {
  return addDoc(guestRoomRef, {
    ...data,

    // finance
    price: data.price ?? 100,
    paid: false,
    paidAt: null,
    paymentMethod: "",
    paymentNote: "",

    // systém
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

/**
 * Úprava rezervace
 */
export async function updateGuestRoomReservation(id, data) {
  return updateDoc(doc(db, "guestRoomReservations", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Smazání rezervace
 */
export async function deleteGuestRoomReservation(id) {
  return deleteDoc(doc(db, "guestRoomReservations", id));
}

/**
 * Označit rezervaci jako zaplacenou / nezaplacenou
 */
export async function markGuestRoomPaid(
  id,
  paid,
  paymentMethod = "",
  paymentNote = "",
  price = 100
) {
  return updateDoc(doc(db, "guestRoomReservations", id), {
    paid,
    price,
    paymentMethod,
    paymentNote,
    paidAt: paid ? serverTimestamp() : null,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Změna ceny rezervace
 */
export async function updateGuestRoomPrice(id, price) {
  return updateDoc(doc(db, "guestRoomReservations", id), {
    price: Number(price),
    updatedAt: serverTimestamp(),
  });
}

/**
 * Změna platebních údajů
 */
export async function updateGuestRoomPayment(id, data) {
  return updateDoc(doc(db, "guestRoomReservations", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Realtime odběr všech rezervací
 */
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

/**
 * Poslední rezervace
 */
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
 * Souhrn plateb
 */
export function calculateGuestRoomPaymentSummary(reservations) {
  const totalReservations = reservations.length;

  const paidReservations =
    reservations.filter((r) => r.paid).length;

  const unpaidReservations =
    totalReservations - paidReservations;

  const collected =
    reservations
      .filter((r) => r.paid)
      .reduce(
        (sum, r) =>
          sum + Number(r.price ?? 100),
        0
      );

  const waiting =
    reservations
      .filter((r) => !r.paid)
      .reduce(
        (sum, r) =>
          sum + Number(r.price ?? 100),
        0
      );

  return {
    totalReservations,
    paidReservations,
    unpaidReservations,
    collected,
    waiting,
  };
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

    const existingArrival = new Date(
      reservation.arrival
    );

    const existingDeparture = new Date(
      reservation.departure
    );

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

      const existingArrival = new Date(
        reservation.arrival
      );

      const existingDeparture = new Date(
        reservation.departure
      );

      return (
        newArrival < existingDeparture &&
        newDeparture > existingArrival
      );
    }) || null
  );
}