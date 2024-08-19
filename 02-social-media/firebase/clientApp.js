import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB2NEjmiKXxhTtm1RibuTwi4s-W3XzNT4g",
  authDomain: "social-media-platform-78408.firebaseapp.com",
  projectId: "social-media-platform-78408",
  storageBucket: "social-media-platform-78408.appspot.com",
  messagingSenderId: "542926`040063",
  appId: "542926040063:web:183a53f16675fe0f6695ca",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
