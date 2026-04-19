import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 🔁 Persist login on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // 🔐 LOGIN / SIGNUP
  const loginAction = (data) => {
    const userData = {
      token: data.token,
      role: data.role,
      fullName: data.fullName,
      enrollmentId: data.enrollmentId || null,
      facultyId: data.facultyId || null,
      semester: data.semester || "", // 🔥 IMPORTANT (store here)
    };

    setUser(userData);

    // store in localStorage
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", data.token);
  };

  // 🔁 Update semester manually (optional use)
  const updateSemester = (sem) => {
    setUser((prev) => {
      const updatedUser = {
        ...prev,
        semester: sem,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  // 🚪 LOGOUT
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loginAction,
        logout,
        updateSemester, // 🔥 optional helper
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// custom hook
export const useAuth = () => useContext(AuthContext);