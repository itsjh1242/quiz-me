import { auth, provider } from "./firebase_config";
import { signInWithPopup } from "firebase/auth";

export function isLogin() {
  try {
    if (auth.currentUser) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
  }
}

export async function signInWithGoogle() {
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("Error signing in with Google", error);
  }
}

export async function signOut() {
  try {
    return auth.signOut();
  } catch (error) {
    console.error("Error signing out with Google", error);
  }
}
