import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { useState, useEffect, useContext, createContext } from "react";
import { auth, db } from "../../firebase";
import { getDoc } from "firebase/firestore";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider(props) {
  const { children } = props;
  const [globalUser, setGlobalUser] = useState(null);
  const [globalData, setGlobalData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  function logout() {
    setGlobalUser(null);
    setGlobalData(null);
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // if there is no user, empty the user state and return from this listener
      if (!user) {
        return;
      }

      // if there is a user, check if the user has data in the db, and if so, then fetch user data and update global state
      try {
        setIsLoading(true);

        // first we create a reference for the document (labelled JSON obj), then we snapshot it
        // to see if there's anything there
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        const firebaseData = {};
        if (docSnap.exists()) {
          console.log("Found user data");
          firebaseData = docSnap.data();
        }
        setGlobalData(firebaseData);
      } catch (err) {
        console.log(err.message);
      } finally {
        setIsLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const value = {
    globalUser,
    globalData,
    setGlobalData,
    isLoading,
    signUp,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
