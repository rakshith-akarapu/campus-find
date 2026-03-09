import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export interface ItemData {
  title: string;
  description: string;
  location: string;
  type: "lost" | "found";
  imageUrl: string;
  userId: string;
  userEmail: string | null;
  status: "open" | "returned";
  createdAt?: any;
}

export const createItem = async (itemData: Omit<ItemData, "createdAt">) => {
  try {
    const docRef = await addDoc(collection(db, "items"), {
      ...itemData,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const updateItemStatus = async (itemId: string, status: "open" | "returned") => {
  try {
    const itemRef = doc(db, "items", itemId);
    await updateDoc(itemRef, { status });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const deleteItem = async (itemId: string) => {
  try {
    const itemRef = doc(db, "items", itemId);
    await deleteDoc(itemRef);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getItemById = async (itemId: string) => {
  try {
    const itemRef = doc(db, "items", itemId);
    const itemSnap = await getDoc(itemRef);
    if (itemSnap.exists()) {
      return { id: itemSnap.id, ...itemSnap.data() };
    } else {
      throw new Error("Item not found");
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};
