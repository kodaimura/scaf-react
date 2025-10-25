import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import Dashboard from "./pages/dashboard/Dashboard";

function PrivateRoute({ children }: { children: React.ReactElement }) {
  const { account } = useAuth();

  if (!account) {
    return <Navigate to="/login" replace />;
  }

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
