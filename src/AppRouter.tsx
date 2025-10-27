import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import Dashboard from "./pages/dashboard/Dashboard";

function PrivateRoute() {
  const { account, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!account) return <Navigate to="/login" replace />;

  return <Outlet />;
}

function PublicRoute() {
  const { account, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (account) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
