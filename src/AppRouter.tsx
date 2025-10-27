import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import LayoutPublic from "./components/layouts/LayoutPublic";
import LayoutPrivate from "./components/layouts/LayoutPrivate";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import Dashboard from "./pages/dashboard/Dashboard";
import NotFound from "./pages/notfound/NotFound";

function PrivateRoute() {
  const { account, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!account) return <Navigate to="/login" replace />;

  return (
    <LayoutPrivate>
      <Outlet />
    </LayoutPrivate>
  );
}

function PublicRoute() {
  const { account, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (account) return <Navigate to="/dashboard" replace />;

  return (
    <LayoutPublic>
      <Outlet />
    </LayoutPublic>
  );
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
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
