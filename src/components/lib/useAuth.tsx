import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { auth } from "../../utils/firebase_config";

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [user]);
  return user;
};

export default useAuth;
