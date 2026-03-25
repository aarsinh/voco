import React, { useState, createContext, useEffect, useCallback } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  role: "ngo" | "volunteer" | null;
  userId: string | null;
  isLoading: boolean;
  login: (username: string, password: string, role: "ngo" | "volunteer") => Promise<void>;
  signup: (formData: Record<string, string>, role: "ngo" | "volunteer") => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<"ngo" | "volunteer" | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:8082/api/auth/validate", {
        credentials: "include",
      });

      const data = await response.json();
      if (data.ok) {
        setIsAuthenticated(true);
        setRole(data.role);
        setUserId(data.id);
      } else {
        setIsAuthenticated(false);
        setRole(null);
        setUserId(null);
      }
    } catch {
      setIsAuthenticated(false);
      setRole(null);
      setUserId(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (username: string, password: string, userRole: "ngo" | "volunteer") => {
    const response = await fetch("http://localhost:8082/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password, role: userRole }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    setIsAuthenticated(true);
    setRole(userRole);
    setUserId(data.id);
  };

  const signup = async (formData: Record<string, string>, userRole: "ngo" | "volunteer") => {
    const { age, sex, website, ...common } = formData;
    const body = userRole === "ngo" ? { website, ...common } : { age, sex, ...common };
    const url = userRole === "ngo"
      ? "http://localhost:8082/api/auth/register/ngo"
      : "http://localhost:8082/api/auth/register/volunteer";

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Signup failed");
    }
  };

  const logout = async () => {
    await fetch("http://localhost:8082/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setIsAuthenticated(false);
    setRole(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, userId, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
