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

    // 🔐 LOGIN (works for both student & faculty)
    const loginAction = (data) => {
      const userData = {
        token: data.token,
        role: data.role,
        fullName: data.fullName,

        // role-based fields
        enrollmentId: data.enrollmentId || null,
        facultyId: data.facultyId || null,
         semester: data.semester || "", // 🔥 IMPORTANT
      };

      setUser(userData);

      // store in localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", data.token);
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
          isAuthenticated: !!user,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  };

  // custom hook
  export const useAuth = () => useContext(AuthContext);