import { createContext, useCallback, useContext, useState } from "react";
import bcrypt from "bcryptjs";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = sessionStorage.getItem("user");

    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(({ username, password }) => {
    const allUsers = JSON.parse(localStorage.getItem("users")) || [];

    if (!allUsers) {
      return false;
    }

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

  const register = useCallback(({ username, password }) => {
    const allUsers = JSON.parse(localStorage.getItem("users")) || [];
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

export const useAuth = () => useContext(AuthContext);
