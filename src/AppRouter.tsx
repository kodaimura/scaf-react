import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import Dashboard from "./pages/dashboard/Dashboard";
import { useEffect, useState } from "react";
import { api } from "./lib/api";

function PrivateRoute({ children }: { children: React.ReactElement }) {
  const { account, setAccount } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const res = await api.get<{ account: any }>("/accounts/me");
        setAccount(res.account);
      } catch {
        setAccount(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAccount();
  }, [setAccount]);

  if (loading) return <div>Loading...</div>;
  if (!account) return <Navigate to="/login" replace />;

  return children;
}


export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
