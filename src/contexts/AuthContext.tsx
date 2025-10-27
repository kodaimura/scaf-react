import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { Account } from "../types/models";
import { api } from "../lib/api";

interface AuthContextType {
  account: Account | null;
  accessToken: string | null;
  setAccount: (account: Account | null) => void;
  setAccessToken: (token: string | null) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<Account | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    setAccount(null);
    setAccessToken(null);
  };

  useEffect(() => {
    api.setAccessToken(accessToken);
    api.setAccessTokenCallback(setAccessToken);
  }, [accessToken]);

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const res = await api.get<{ account: Account }>("/accounts/me");
        setAccount(res.account);
      } catch {
        setAccount(null);
      } finally {
        setLoading(false);
      }
    };
    fetchAccount();
  }, []);

  return (
    <AuthContext.Provider
      value={{ account, accessToken, setAccount, setAccessToken, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
