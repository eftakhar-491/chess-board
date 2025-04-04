"use client";
import { auth } from "@/lib/firebase.config";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { get, getDatabase, push, ref, set } from "firebase/database";

export const AuthContext = createContext();
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const postData = async (path, data) => {
    const db = getDatabase();
    const dbRef = push(ref(db, path));
    try {
      await set(dbRef, data);
    } catch (error) {
      console.error("Error posting data:", error);
      throw error; // Rethrow the error for further handling if needed
    }
  };
  const getData = async (path) => {
    const db = getDatabase();
    const dbRef = await ref(db, path);
    const snap = await get(dbRef);

    if (snap.exists()) {
      return Object.entries(snap.val()).map(([key, value]) => ({
        id: key,
        ...value,
      }));
    }
    return []; // Return an empty array if no data exists
  };

  // register user
  function registerUser(email, password) {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  }

  //   login existing user
  const loginUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  //   logout user
  const logoutUser = () => {
    setLoading(true);
    setUser(null);
    return signOut(auth);
  };
  // update user functionality for using in register page
  const updateUserProfile = (profile) => {
    return updateProfile(auth.currentUser, profile);
  };

  // google login
  const googleProvider = new GoogleAuthProvider();
  const googleSignIn = () => {
    return signInWithPopup(auth, googleProvider);
  };
  const resetEmail = (email) => {
    return email.replace(/[.#$[\]]/g, "");
  };
  // firebase observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        if (currentUser?.email) {
          const p = resetEmail(currentUser?.email);

          const userData = await getData(`users/${p}`);

          if (userData?.length === 0) {
            postData(`users/${p}`, {
              name: currentUser.displayName,
              email: currentUser.email,
            });
          }
        }
      }
      setLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const userInfo = {
    user,
    setUser,
    registerUser,
    loginUser,
    logoutUser,
    updateUserProfile,
    googleSignIn,
    loading,
    setLoading,
    postData,
    getData,
    resetEmail,
  };

  return (
    <AuthContext.Provider value={userInfo}>{children}</AuthContext.Provider>
  );
}
