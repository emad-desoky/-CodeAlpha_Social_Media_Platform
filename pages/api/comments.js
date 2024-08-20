import { db } from "@/firebase/clientApp"; // Import your Firestore instance
import {
  collection,
  getDocs,
  addDoc,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

// Reference to the Firestore collection
const commentsCollection = collection(db, "comments");

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      // Fetch all documents from the 'comments' collection
      const querySnapshot = await getDocs(commentsCollection);
      const comments = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      res.status(200).json(comments);
    } catch (error) {
      console.error("GET Error:", error);
      res.status(500).json({ error: "Failed to read data" });
    }
  } else if (req.method === "POST") {
    const newComment = req.body;

    try {
      // Add a new document to the 'comments' collection
      const docRef = await addDoc(commentsCollection, newComment);
      res.status(201).json({ id: docRef.id, ...newComment });
    } catch (error) {
      console.error("POST Error:", error);
      res.status(500).json({ error: "Failed to write data" });
    }
  } else if (req.method === "PUT") {
    const updatedComment = req.body;

    try {
      // Update the specific document in the 'comments' collection
      const docRef = doc(db, "comments", updatedComment.id);
      await setDoc(docRef, updatedComment, { merge: true });
      res.status(200).json(updatedComment);
    } catch (error) {
      console.error("PUT Error:", error);
      res.status(500).json({ error: "Failed to update data" });
    }
  } else if (req.method === "DELETE") {
    const { id } = req.query;

    try {
      // Delete the specific document from the 'comments' collection
      const docRef = doc(db, "comments", id);
      await deleteDoc(docRef);
      res.status(200).json({ message: "Element deleted successfully" });
    } catch (error) {
      console.error("DELETE Error:", error);
      res.status(500).json({ error: "Failed to delete data" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
