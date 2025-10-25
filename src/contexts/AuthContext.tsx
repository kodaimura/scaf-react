import type { Account } from "../types/models";
import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";

interface AuthContextType {
  account: Account | null;
  accessToken: string | null;
  setAccount: (account: Account | null) => void;
  setAccessToken: (token: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<Account | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const logout = () => {
    setAccount(null);
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ account, accessToken, setAccount, setAccessToken, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
