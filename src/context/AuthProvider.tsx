import { useCallback, useEffect, useState } from "react";
import * as AuthService from "../services/AuthService";
import { AuthContext, type AuthUser } from "./AuthContext";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { user } = await AuthService.refresh();
        setUser(user);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { user } = await AuthService.login(email, password);
    setUser(user);
  }, []);

  const logout = useCallback(async () => {
    AuthService.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
