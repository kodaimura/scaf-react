import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useAuth } from "@contexts/AuthContext";
import { ROUTES } from "@/routes";
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
  if (!account) return <Navigate to={ROUTES.login} replace />;

  return (
    <LayoutPrivate>
      <Outlet />
    </LayoutPrivate>
  );
};

const PublicRoute = () => {
  const { account, loading } = useAuth();

  if (loading) return <Processing text="読み込み中..." />;
  if (account) return <Navigate to={ROUTES.dashboard} replace />;

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
          <Route path={ROUTES.login} element={<Login />} />
          <Route path={ROUTES.signup} element={<Signup />} />
          <Route path={ROUTES.forgotPassword} element={<ForgotPassword />} />
          <Route path={ROUTES.resetPassword} element={<ResetPassword />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path={ROUTES.home} element={<Dashboard />} />
          <Route
            path={ROUTES.dashboard}
            element={<Navigate to={ROUTES.home} replace />}
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
