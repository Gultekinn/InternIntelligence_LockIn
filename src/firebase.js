import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  reload,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";
import toast from "react-hot-toast";
import store from "./store";
import { login as loginHandle, logout as logoutHandle } from "./store/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();

export const register = async (email, password, displayName) => {
  try {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await updateProfile(user, { displayName });

    await reload(user);

    store.dispatch(
      loginHandle({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      })
    );

    return user;
  } catch (error) {
    toast.error(error.message);
  }
};

export const passwordResetEmail = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    toast.success(`Password reset email sent to ${email}`);
  } catch (error) {
    toast.error(error.message);
  }
};

export const emailVerification = async () => {
  try {
    await sendEmailVerification(auth.currentUser);
    toast.success(`Send email verification ${auth.currentUser.email} adress`);
  } catch (error) {
    toast.error(error.message);
  }
};

export const update = async (data) => {
  try {
    await updateProfile(auth.currentUser, data);
  } catch (error) {
    toast.error(error.message);
  }
};

export const login = async (email, password) => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return user;
  } catch (error) {
    console.error("Login Error:", error.code, error.message);
    toast.error(error.message);
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    store.dispatch(logoutHandle());
    return true;
  } catch (error) {
    toast.error(error.message);
  }
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    store.dispatch(
      loginHandle({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      })
    );
  } else {
    store.dispatch(logoutHandle());
  }
});

export default app;
