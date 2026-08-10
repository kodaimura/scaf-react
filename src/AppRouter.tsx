import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useAuth } from "@contexts/AuthContext";
import LayoutPublic from "@layouts/LayoutPublic";
import LayoutPrivate from "@layouts/LayoutPrivate";
import Processing from "@ui/Processing";
import Login from "@pages/login/Login";
import Signup from "@pages/signup/Signup";
import ForgotPassword from "@pages/forgot-password/ForgotPassword";
import ResetPassword from "@pages/reset-password/ResetPassword";
import Dashboard from "@pages/dashboard/Dashboard";
import NotFound from "@pages/notfound/NotFound";

const PrivateRoute = () => {
  const { account, loading } = useAuth();

  if (loading) return <Processing text="読み込み中..." />;
  if (!account) return <Navigate to="/login" replace />;

  return (
    <LayoutPrivate>
      <Outlet />
    </LayoutPrivate>
  );
};

const PublicRoute = () => {
  const { account, loading } = useAuth();

  if (loading) return <Processing text="読み込み中..." />;
  if (account) return <Navigate to="/dashboard" replace />;

  return (
    <LayoutPublic>
      <Outlet />
    </LayoutPublic>
  );
};

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
