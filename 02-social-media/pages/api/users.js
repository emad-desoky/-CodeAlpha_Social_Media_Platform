import { db } from "@/firebase/clientApp";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  writeBatch,
} from "firebase/firestore";

const usersCollection = collection(db, "users");
const postsCollection = collection(db, "posts");

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      if (req.query.username) {
        const userQuery = query(
          usersCollection,
          where("username", "==", req.query.username)
        );
        const querySnapshot = await getDocs(userQuery);
        const user = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))[0];
        res.status(200).json(user);
      } else {
        const snapshot = await getDocs(usersCollection);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        res.status(200).json(data);
      }
    } catch (error) {
      console.error("GET Error:", error);
      res.status(500).json({ error: "Failed to fetch data" });
    }
  } else if (req.method === "POST") {
    try {
      const newElement = req.body;
      const existingUserQuery = query(
        usersCollection,
        where("username", "==", newElement.username)
      );
      const existingUsers = await getDocs(existingUserQuery);

      if (!existingUsers.empty) {
        res.status(400).json({ message: "Username Already Exists" });
      } else {
        const docRef = await addDoc(usersCollection, {
          ...newElement,
          likedReceived: 0,
          likesGiven: 0,
          likedPosts: [],
          friends: [],
          following: [],
          followers: [],
        });
        res.status(201).json({ id: docRef.id, ...newElement });
      }
    } catch (error) {
      console.error("POST Error:", error);
      res.status(500).json({ error: "Failed to add data" });
    }
  } else if (req.method === "PUT") {
    try {
      const updatedElement = req.body;
      console.log(req.body);

      const userQuery = query(
        usersCollection,
        where("username", "==", updatedElement.username)
      );
      const userSnapshot = await getDocs(userQuery);

      if (userSnapshot.empty) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      const userDocRef = doc(db, "users", userSnapshot.docs[0].id);

      // Update user document
      await updateDoc(userDocRef, updatedElement);

      // Thexxkiller says hi
      const usersSnapshot = await getDocs(usersCollection);
      const postsSnapshot = await getDocs(postsCollection);

      const usersArr = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const postsArr = postsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const likedPosts = usersArr.map((u) => u.likedPosts).flat();
      postsArr.map(
        (post) => (post.likes = likedPosts.filter((lp) => lp == post.id).length)
      );

      // Step 1: Delete existing documents
      const deleteBatch = writeBatch(db);
      // Delete each document in the collection
      for (const docSnap of postsSnapshot.docs) {
        deleteBatch.delete(doc(db, "posts", docSnap.id));
      }
      await deleteBatch.commit();

      // Step 2: Add new documents
      const addBatch = writeBatch(db); // Use a batch to perform multiple writes

      postsArr.forEach((post) => {
        const postRef = doc(postsCollection, post.id); // Create a reference to the new document
        addBatch.set(postRef, post); // Set the new document data
      });
      await addBatch.commit(); // Commit the batch write

      res.status(200).json(updatedElement);
    } catch (error) {
      console.error("PUT Error:", error.message);
      console.error("Stack Trace:", error.stack);
      res.status(500).json({ error: "Failed to update data" });
    }
  } else if (req.method === "DELETE") {
    try {
      const { username } = req.query;

      if (username === "all") {
        const querySnapshot = await getDocs(usersCollection);
        const deletePromises = querySnapshot.docs.map((doc) =>
          deleteDoc(doc.ref)
        );
        await Promise.all(deletePromises);
        res.status(200).json({ message: "All users deleted successfully" });
      } else {
        const userQuery = query(
          usersCollection,
          where("username", "==", username)
        );
        const userSnapshot = await getDocs(userQuery);
        if (userSnapshot.empty) {
          res.status(404).json({ error: "Element not found" });
        } else {
          const userDocRef = doc(db, "users", userSnapshot.docs[0].id);
          await deleteDoc(userDocRef);
          res.status(200).json({ message: "Element deleted successfully" });
        }
      }
    } catch (error) {
      console.error("DELETE Error:", error);
      res.status(500).json({ error: "Failed to delete data" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
