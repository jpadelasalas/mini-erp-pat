import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import { useAuth } from "./context/AuthContext";
import Loading from "./components/Loading";

const PublicRoute = lazy(() => import("./components/PublicRoute"));
const Login = lazy(() => import("./pages/Login"));

const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));
const Layout = lazy(() => import("./layout/Layout"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Inventory = lazy(() => import("./pages/Inventory"));
const Sales = lazy(() => import("./pages/Sales"));
const Employees = lazy(() => import("./pages/Employees"));

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Redirect root and wildcard */}
          <Route
            path="/"
            element={<Navigate to={user ? "/dashboard" : "/login"} />}
          />
          <Route
            path="*"
            element={<Navigate to={user ? "/dashboard" : "/login"} />}
          />

          {/* Public Routes */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="sales" element={<Sales />} />
              <Route path="employees" element={<Employees />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
