import { db } from "@/firebase/clientApp"; // Import your Firestore instance
import { collection, getDocs, query, where } from "firebase/firestore";

// Reference to the Firestore collection
const usersCollection = collection(db, "users");

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { username, password } = req.body;

    try {
      // Create a query to find the user with matching username and password
      const q = query(
        usersCollection,
        where("username", "==", username),
        where("password", "==", password)
      );

      // Execute the query
      const querySnapshot = await getDocs(q);

      // Check if user exists
      if (querySnapshot.empty) {
        return res.status(200).json({ message: "Invalid Credentials" });
      }

      // Get user data
      const foundUser = querySnapshot.docs[0].data();
      return res
        .status(200)
        .json({ id: querySnapshot.docs[0].id, ...foundUser });
    } catch (error) {
      console.error("Error retrieving user data from Firestore:", error);
      return res.status(500).json({ error: "Failed to retrieve user data" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
