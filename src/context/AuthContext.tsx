import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import bcrypt from "bcryptjs";
import type { User } from "../types";
import { getLocalData } from "../lib/storage";

export type Credentials = { username: string; password: string };
type StoredUser = User & { password: string };

type AuthValue = {
  user: User | null;
  login: (creds: Credentials) => boolean;
  register: (creds: Credentials) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthValue | null>(null);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = sessionStorage.getItem("user");

    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(({ username, password }: Credentials) => {
    const allUsers = getLocalData<StoredUser[]>("users", []);

    const userInfo = allUsers.find(
      (u) => u.username === username && bcrypt.compareSync(password, u.password)
    );

    if (!userInfo) {
      return false;
    }

    setUser({ username: userInfo.username, id: userInfo.id });
    sessionStorage.setItem(
      "user",
      JSON.stringify({ username: userInfo.username, id: userInfo.id })
    );
    return true;
  }, []);

  const register = useCallback(({ username, password }: Credentials) => {
    const allUsers = getLocalData<StoredUser[]>("users", []);
    const isExisting = allUsers.some((u) => u.username === username);

    if (isExisting) {
      return false;
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const id = crypto.randomUUID();
    setUser({ id, username });
    allUsers.push({ id: id, username, password: hash });
    localStorage.setItem("users", JSON.stringify(allUsers));
    sessionStorage.setItem(
      "user",
      JSON.stringify({ id: id, username: username })
    );

    return true;
  }, []);

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthContextProvider");
  return ctx;
};
